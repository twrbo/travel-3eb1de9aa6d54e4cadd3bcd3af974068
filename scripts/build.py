"""Generate archive pages and navigation using Python's standard library."""
import argparse
from datetime import date
from html import escape
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
NAV_PATTERN = r'<!-- TRIP_NAV_START -->.*?<!-- TRIP_NAV_END -->'


def render(template, **values):
    for key, value in values.items():
        template = template.replace('{{' + key + '}}', str(value))
    if re.search(r'\{\{[A-Z_]+\}\}', template):
        raise ValueError('Unresolved template value')
    return template


def load_catalog():
    catalog = json.loads((ROOT / 'data/trips.json').read_text(encoding='utf-8'))
    countries = catalog['countries']
    slugs = [c['slug'] for c in countries]
    if len(set(slugs)) != len(slugs) or any(not re.fullmatch(r'[a-z][a-z0-9-]*', s) for s in slugs):
        raise ValueError('Country slugs must be unique lowercase slugs')
    ids, paths = set(), set()
    for trip in catalog['trips']:
        start, end = date.fromisoformat(trip['startDate']), date.fromisoformat(trip['endDate'])
        if start.isoformat() != trip['startDate'] or end.isoformat() != trip['endDate'] or end < start:
            raise ValueError('Invalid trip dates')
        if trip['country'] not in slugs or not trip['city'].strip():
            raise ValueError('Unknown country or missing city')
        path = f"{trip['country']}/{trip['startDate']}/"
        if trip['id'] in ids or path in paths:
            raise ValueError('Trip IDs and country/date paths must be unique')
        if not (ROOT / path / 'index.html').is_file():
            raise ValueError(f'Missing itinerary page: {path}')
        ids.add(trip['id'])
        paths.add(path)
    destinations = {'/' + s + '/' for s in slugs} | {'/' + p for p in paths}
    for old, new in catalog['legacyRoutes'].items():
        if not re.fullmatch(r'/[a-z0-9/-]+/', old) or new not in destinations or old in destinations:
            raise ValueError(f'Invalid legacy route: {old}')
    return catalog


def generate(catalog):
    trips = sorted(catalog['trips'], key=lambda t: t['startDate'], reverse=True)
    countries = sorted(catalog['countries'], key=lambda c: max(
        (t['startDate'] for t in trips if t['country'] == c['slug']), default=''), reverse=True)
    cards = []
    output = {}
    country_template = (ROOT / 'templates/country.html').read_text(encoding='utf-8')
    for country in countries:
        group = [t for t in trips if t['country'] == country['slug']]
        name, slug = escape(country['name']), country['slug']
        rows = []
        for trip in group:
            start, end = trip['startDate'], trip['endDate']
            days = (date.fromisoformat(end) - date.fromisoformat(start)).days + 1
            rows.append(f'''      <li><a class="trip" href="{start}/" data-start="{start}">
        <div><p class="dates"><time datetime="{start}">{start.replace('-', '/')}</time> — <time datetime="{end}">{end.replace('-', '/')}</time></p>
        <h2>{escape(trip['city'])}・{start[:4]}</h2><p class="detail">{days} 天行程</p></div>
        <span class="open">查看行程 →</span>
      </a></li>''')
            page = ROOT / slug / start / 'index.html'
            html = page.read_text(encoding='utf-8')
            nav = f'''<!-- TRIP_NAV_START -->
  <nav class="topnav" aria-label="旅程導覽"><a href="../../">Travel Index</a> / <a href="../">{name}</a> / {start.replace('-', '/')} {escape(trip['city'])}</nav>
  <nav class="trip-switch" aria-label="{name}行程日期">'''
            nav += ''.join(f'<a href="../{t["startDate"]}/"' + (' aria-current="page"' if t['id'] == trip['id'] else '') + f'>{t["startDate"].replace("-", "/")} {escape(t["city"])}</a>' for t in group)
            nav += '</nav>\n  <!-- TRIP_NAV_END -->'
            if len(re.findall(NAV_PATTERN, html, re.S)) != 1:
                raise ValueError(f'Expected one navigation marker pair: {page.relative_to(ROOT)}')
            output[page.relative_to(ROOT).as_posix()] = re.sub(NAV_PATTERN, lambda _: nav, html, flags=re.S)
        output[f'{slug}/index.html'] = render(country_template, NAME=name,
            ENGLISH_NAME=escape(country['englishName']), COUNT=len(group), TRIPS='\n'.join(rows))
        latest = group[0]['startDate'] if group else ''
        cities = escape('、'.join(dict.fromkeys(t['city'] for t in group)))
        latest_text = f'最新出發：{latest.replace("-", ".")}' if latest else '尚無行程'
        cards.append(f'''      <a class="trip-card" href="{slug}/" aria-label="查看{name}行程清單" data-latest="{latest}"><p class="trip-code">{escape(country['code'])} · {escape(country['englishName'].upper())}</p><h3>{name}</h3><p class="trip-detail">{len(group)} 趟旅程 · {cities}<br>{latest_text}</p><span class="trip-cta">行程清單 <b aria-hidden="true">→</b></span></a>''')
    output['index.html'] = render((ROOT / 'templates/home.html').read_text(encoding='utf-8'),
        COUNTS=f'{len(countries)} 個國家 · {len(trips)} 趟旅程', COUNTRIES='\n'.join(cards))
    output['_redirects'] = '# Generated by scripts/build.py; supported by Cloudflare Pages and Netlify.\n' + ''.join(
        f'{source} {target} 301\n{source[:-1]} {target} 301\n{source}index.html {target} 301\n'
        for source, target in catalog['legacyRoutes'].items())
    output['assets/js/legacy-routes.js'] = '// Generated by scripts/build.py.\n(() => {\n  const routes = ' + json.dumps(catalog['legacyRoutes'], ensure_ascii=False, indent=2) + ''';
  const path = location.pathname.replace(/index\\.html$/, '').replace(/\\/?$/, '/');
  for (const [oldPath, destination] of Object.entries(routes).sort((a, b) => b[0].length - a[0].length)) {
    if (path.endsWith(oldPath)) {
      const prefix = path.slice(0, -oldPath.length);
      location.replace(prefix + destination + location.search + location.hash);
      return;
    }
  }
})();
'''
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail if generated pages are out of date')
    args = parser.parse_args()
    output = generate(load_catalog())
    stale = []
    for name, content in output.items():
        path = ROOT / name
        if not path.exists() or path.read_text(encoding='utf-8') != content:
            stale.append(name)
            if not args.check:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding='utf-8', newline='\n')
    if args.check and stale:
        raise SystemExit('Generated files are out of date: ' + ', '.join(stale))
    print(f'{"Checked" if args.check else "Generated"} {len(output)} files.')


if __name__ == '__main__':
    main()
