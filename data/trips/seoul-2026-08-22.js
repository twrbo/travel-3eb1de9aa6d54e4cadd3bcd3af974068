// Final map data for this trip. Keep each entry in one place.
const ROUTES = {
  "d1": {
    "title": "抵達日｜仁川 T1 → 飯店 → 晚餐 → 換錢 → Olive Young → 飯店",
    "points": [
      {
        "label": "1",
        "name": "仁川機場第1航廈",
        "lat": 37.4602,
        "lng": 126.4407,
        "time": "15:35",
        "category": "other"
      },
      {
        "label": "2",
        "name": "首爾站 A01 / 133",
        "lat": 37.5547,
        "lng": 126.9707,
        "time": "轉乘",
        "category": "other"
      },
      {
        "label": "",
        "name": "Blue Duck Hotel",
        "lat": 37.5713,
        "lng": 127.006,
        "time": "約 18:00",
        "category": "hotel"
      },
      {
        "label": "3",
        "name": "陳玉華奶奶元祖一隻雞",
        "lat": 37.570374,
        "lng": 127.00568,
        "time": "晚餐主選",
        "category": "food"
      },
      {
        "label": "4",
        "name": "Money Box 明洞本店",
        "lat": 37.56206676686479,
        "lng": 126.98163611717736,
        "time": "晚餐後換錢",
        "category": "other"
      },
      {
        "label": "5",
        "name": "Olive Young 廣藏市場",
        "lat": 37.57,
        "lng": 126.9995,
        "time": "換錢後",
        "category": "shop"
      },
      {
        "label": "",
        "name": "Blue Duck Hotel",
        "lat": 37.5713,
        "lng": 127.006,
        "time": "回飯店",
        "category": "hotel"
      }
    ],
    "groute": [
      "Incheon International Airport Terminal 1",
      "Seoul Station",
      "Blueduck hotel Seoul",
      "진옥화할매원조닭한마리",
      "Money Box Myeongdong Main Branch",
      "Olive Young Gwangjang Market",
      "Blueduck hotel Seoul"
    ]
  },
  "d2": {
    "title": "早餐 → 首爾林 → Verish → MLB／emis → STAND OIL → Jojo 刀削麵",
    "points": [
      {
        "label": "",
        "name": "Blue Duck Hotel",
        "lat": 37.5713,
        "lng": 127.006,
        "time": "早上",
        "category": "hotel"
      },
      {
        "label": "1",
        "name": "Isaac Toast 鐘路3街店",
        "lat": 37.57,
        "lng": 126.9875,
        "time": "早餐主選",
        "category": "food"
      },
      {
        "label": "2",
        "name": "首爾林 K211",
        "lat": 37.5437,
        "lng": 127.0447,
        "time": "約 11:20",
        "category": "other"
      },
      {
        "label": "3",
        "name": "JUUNEEDU",
        "lat": 37.5467,
        "lng": 127.0427,
        "time": "12:00",
        "category": "shop"
      },
      {
        "label": "4",
        "name": "Verish",
        "lat": 37.5425,
        "lng": 127.0522,
        "time": "指定",
        "category": "shop"
      },
      {
        "label": "5",
        "name": "MLB 聖水旗艦店",
        "lat": 37.5442,
        "lng": 127.0547,
        "time": "Verish 後",
        "category": "shop"
      },
      {
        "label": "6",
        "name": "emis 聖水旗艦店",
        "lat": 37.5445,
        "lng": 127.055,
        "time": "MLB 後",
        "category": "shop"
      },
      {
        "label": "7",
        "name": "STAND OIL",
        "lat": 37.5423,
        "lng": 127.058,
        "time": "帽子店後",
        "category": "shop"
      },
      {
        "label": "8",
        "name": "Jojo Kalguksu",
        "lat": 37.5451,
        "lng": 127.0538,
        "time": "逛完後晚餐",
        "category": "food"
      },
      {
        "label": "",
        "name": "Blue Duck Hotel",
        "lat": 37.5713,
        "lng": 127.006,
        "time": "回飯店",
        "category": "hotel"
      }
    ],
    "groute": [
      "Blueduck hotel Seoul",
      "이삭토스트 종로3가점",
      "Seoul Forest Station",
      "JUUNEEDU Seoul Forest",
      "Verish Seongsu",
      "MLB Seongsu Flagship Store",
      "emis Seongsu",
      "STAND OIL Seongsu",
      "Jojo Kalguksu Seongsu",
      "Blueduck hotel Seoul"
    ]
  },
  "d3": {
    "title": "鐘路豬肉湯飯 → 明洞鞋店 → 弘大刷具店 → 弘大晚餐",
    "points": [
      {
        "label": "",
        "name": "Blue Duck Hotel",
        "lat": 37.5713,
        "lng": 127.006,
        "time": "早上",
        "category": "hotel"
      },
      {
        "label": "1",
        "name": "嚴龍白豬肉湯飯 鐘閣店",
        "lat": null,
        "lng": null,
        "time": "起床後第一餐",
        "category": "food",
        "mapDisabled": true
      },
      {
        "label": "2",
        "name": "Olive Young 明洞",
        "lat": 37.5638,
        "lng": 126.985,
        "time": "豬肉湯飯後",
        "category": "shop"
      },
      {
        "label": "3",
        "name": "CHAAKAN 明洞旗艦店",
        "lat": 37.5622,
        "lng": 126.9865,
        "time": "Olive Young 後",
        "category": "shop"
      },
      {
        "label": "4",
        "name": "Revoir Custom Brush",
        "lat": 37.5524,
        "lng": 126.9248,
        "time": "弘大刷具",
        "category": "shop"
      },
      {
        "label": "5",
        "name": "HOMI Art Shop 弘大店",
        "lat": 37.55337,
        "lng": 126.92172,
        "time": "弘大刷具",
        "category": "shop"
      },
      {
        "label": "6",
        "name": "給豚的男人",
        "lat": 37.5508,
        "lng": 126.9206,
        "time": "晚餐主選",
        "category": "food"
      },
      {
        "label": "",
        "name": "Blue Duck Hotel",
        "lat": 37.5713,
        "lng": 127.006,
        "time": "回飯店",
        "category": "hotel"
      }
    ],
    "groute": [
      "Blueduck hotel Seoul",
      "Eomyongbaek Dwaeji Gukbap Jonggak",
      "Olive Young Myeongdong Town",
      "CHAAKAN Myeongdong",
      "Revoir Custom Brush Seoul",
      "Homi Art Shop Hongdae",
      "돈주는남자 본점",
      "Blueduck hotel Seoul"
    ]
  },
  "d4": {
    "title": "美式早午餐 → 清潭醫美 → 新沙烤黨 → 取行李 → 首爾站採買 → 雲西",
    "points": [
      {
        "label": "",
        "name": "Blue Duck Hotel",
        "lat": 37.5713,
        "lng": 127.006,
        "time": "08:25",
        "category": "hotel"
      },
      {
        "label": "1",
        "name": "Oasis Cheongdam",
        "lat": 37.525,
        "lng": 127.0384,
        "time": "09:10 早午餐",
        "category": "food"
      },
      {
        "label": "2",
        "name": "LUNN Clinic",
        "lat": 37.5259,
        "lng": 127.0409,
        "time": "10:30 醫美",
        "category": "other"
      },
      {
        "label": "3",
        "name": "烤黨／꿉당 新沙店",
        "lat": 37.5166367,
        "lng": 127.0190596,
        "time": "15:20–17:00 晚餐",
        "category": "food"
      },
      {
        "label": "",
        "name": "Blue Duck Hotel",
        "lat": 37.5713,
        "lng": 127.006,
        "time": "約 18:15 取行李",
        "category": "hotel"
      },
      {
        "label": "4",
        "name": "Lotte Mart Zettaplex 首爾站店",
        "lat": 37.5547,
        "lng": 126.9707,
        "time": "約 19:00 採買",
        "category": "shop"
      },
      {
        "label": "5",
        "name": "首爾站 A01",
        "lat": 37.5547,
        "lng": 126.9707,
        "time": "轉 AREX",
        "category": "other",
        "mapDisabled": true
      },
      {
        "label": "",
        "name": "雲西 A08／機場飯店",
        "lat": 37.4932,
        "lng": 126.4935,
        "time": "約 21:00–21:15",
        "category": "hotel"
      }
    ],
    "groute": [
      "Blueduck hotel Seoul",
      "Oasis Cheongdam",
      "LUNN Dermatology Cheongdam",
      "Ggupdang Sinsa",
      "Blueduck hotel Seoul",
      "Lotte Mart Zettaplex Seoul Station",
      "Incheon Airport Global Hotel & Suites Unseo"
    ]
  },
  "d5": {
    "title": "雲西 → 仁川 T1 → 機場早餐",
    "points": [
      {
        "label": "",
        "name": "雲西 A08／機場飯店",
        "lat": 37.4932,
        "lng": 126.4935,
        "time": "06:00",
        "category": "hotel"
      },
      {
        "label": "1",
        "name": "A10 仁川機場第1航廈",
        "lat": 37.4602,
        "lng": 126.4407,
        "time": "約 06:20",
        "category": "other"
      },
      {
        "label": "2",
        "name": "Paris Baguette T1",
        "lat": 37.45995,
        "lng": 126.44095,
        "time": "早餐主選",
        "category": "food"
      }
    ],
    "groute": [
      "Unseo Station",
      "Incheon International Airport Terminal 1",
      "Paris Baguette Incheon Airport Terminal 1"
    ]
  }
};
const NAVER_POINT_QUERIES = {
  "仁川機場第1航廈": "인천공항1터미널",
  "A10 仁川機場第1航廈": "인천공항1터미널",
  "首爾站 A01 / 133": "서울역",
  "首爾站 A01": "서울역",
  "首爾林 K211": "서울숲역",
  "弘大入口 239": "홍대입구역",
  "雲西 A08／機場飯店": "운서역",
  "Blue Duck Hotel": "블루덕호텔 종로",
  "Incheon Airport Global Hotel & Suites Unseo": "인천공항 글로벌 호텔 앤드 스위트",
  "Money Box 明洞本店": "머니박스 명동본점",
  "Isaac Toast 鐘路3街店": "이삭토스트 종로3가점",
  "Paris Baguette 清潭站店": "파리바게뜨 청담역점",
  "Paris Baguette T1": "파리바게뜨 인천공항 1터미널",
  "Olive Young 廣藏市場": "올리브영 광장마켓점",
  "Olive Young 明洞": "올리브영 명동타운",
  "JUUNEEDU": "쥬니쥬 쇼룸 서울숲점",
  "Verish": "베리시 성수 플래그십 스토어",
  "無垢屋": "무구옥 성수점",
  "STAND OIL": "스탠드오일 성수",
  "Jojo Kalguksu": "조조칼국수 성수점",
  "JO & DAWSON": "조앤도슨 광화문점",
  "明洞餃子 本店": "명동교자 본점",
  "給豚的男人": "돈주는남자 본점",
  "LUNN Clinic": "룬피부과 청담",
  "烤黨／꿉당 新沙店": "꿉당 신사",
  "Lotte Mart Zettaplex 首爾站店": "롯데마트 제타플렉스 서울역점",
  "MLB 聖水旗艦店": "MLB 성수점",
  "emis 聖水旗艦店": "이미스 성수",
  "陳玉華奶奶元祖一隻雞": "진옥화할매원조닭한마리",
  "清進屋 Cheongjinok": "청진옥 종로",
  "清潭골 Cheongdam-gol": "청담골",
  "손수헌 Sonsuheon T1": "손수헌 인천공항 T1"
};
const MEAL_CANDIDATES = {
  "d1": [
    {
      "label": "3-1",
      "name": "順姬家綠豆煎餅",
      "query": "순희네 빈대떡 광장시장 서울"
    },
    {
      "label": "3-2",
      "name": "名人雪濃湯",
      "query": "명인설렁탕 종로 서울"
    }
  ],
  "d2": [
    {
      "label": "8-1",
      "name": "Somunnan Seongsu Gamjatang",
      "query": "소문난성수감자탕 서울"
    },
    {
      "label": "8-2",
      "name": "大成排骨 成水店",
      "query": "대성갈비 성수 서울"
    }
  ],
  "d3": [
    {
      "label": "6-1",
      "name": "新美京弘大辣炒雞排",
      "query": "신미경홍대닭갈비 서울"
    },
    {
      "label": "6-2",
      "name": "新村食堂 弘大西橋店",
      "query": "새마을식당 홍대서교점"
    }
  ],
  "d4": [],
  "d5": [
    {
      "label": "2-1",
      "name": "HOLLYS Coffee 仁川 T1",
      "query": "할리스 인천공항T1점"
    }
  ]
};
