"""Check generated output, local HTML references, IDs, and JavaScript syntax."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.references, self.errors = path, set(), [], []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.errors.append(f'Duplicate ID {attrs["id"]}: {self.path}')
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if attrs.get(key):
                self.references.append(attrs[key])


def main():
    subprocess.run([sys.executable, str(ROOT / 'scripts/build.py'), '--check'], check=True)
    paths = [ROOT / 'index.html', ROOT / '404.html'] + list(ROOT.glob('japan/**/*.html')) + list(ROOT.glob('korea/**/*.html'))
    pages = {p.resolve(): Page(p) for p in paths}
    errors = []
    count = 0
    for path, page in pages.items():
        errors.extend(page.errors)
        for reference in page.references:
            url = urlsplit(reference)
            if url.scheme or url.netloc:
                continue
            target = ((ROOT if url.path.startswith('/') else path.parent) / unquote(url.path.lstrip('/'))).resolve() if url.path else path
            if target.is_dir():
                target /= 'index.html'
            count += 1
            if not target.is_file():
                errors.append(f'Missing target: {path.relative_to(ROOT)} -> {reference}')
            elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
                errors.append(f'Missing anchor: {path.relative_to(ROOT)} -> {reference}')
    if errors:
        raise SystemExit('\n'.join(errors))
    scripts = sorted((ROOT / 'assets/js').glob('*.js')) + sorted((ROOT / 'data/trips').glob('*.js'))
    for script in scripts:
        subprocess.run(['node', '--check', str(script)], check=True)
    subprocess.run(['node', str(ROOT / 'scripts/check-redirects.cjs')], check=True)
    print(f'Checked {len(pages)} HTML pages, {count} local references and {len(scripts)} JavaScript files.')


if __name__ == '__main__':
    main()
