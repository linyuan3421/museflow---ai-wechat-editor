const fs = require('fs');

const colors = JSON.parse(fs.readFileSync('data/knowledge/colors.json', 'utf8'));

// Add more entries
const newEntries = [
  {
    "id": "color-japon-tokusa",
    "type": "color_palette",
    "keywords": ["木賊", "tokusa", "草绿", "初春", "spring green", "japanese"],
    "name": "日本传统色 - 木賊",
    "description": "日本传统色「木賊」，象征初春的草绿色",
    "data": {
      "colors": ["#5D4037"],
      "englishName": "Moss Green",
      "culturalOrigin": "日本传统色"
    }
  },
  {
    "id": "color-japon-wakatake",
    "type": "color_palette",
    "keywords": ["若竹", "wakatake", "嫩竹", "light bamboo", "japanese", "bamboo"],
    "name": "日本传统色 - 若竹",
    "description": "日本传统色「若竹」，嫩竹的浅绿色",
    "data": {
      "colors": ["#8FA68C"],
      "englishName": "Light Bamboo",
      "culturalOrigin": "日本传统色"
    }
  },
  {
    "id": "color-japon-benikake",
    "type": "color_palette",
    "keywords": ["紅脖", "benikake", "粉红", "blush pink", "japanese", "cherry blossom"],
    "name": "日本传统色 - 紅脖",
    "description": "日本传统色「紅脖」，如同脸颊般的粉红色",
    "data": {
      "colors": ["#F8C3CD"],
      "englishName": "Blush Pink",
      "culturalOrigin": "日本传统色"
    }
  },
  {
    "id": "color-japon-sencha",
    "type": "color_palette",
    "keywords": ["煎茶", "sencha", "茶绿", "matcha green", "japanese tea", "and style"],
    "name": "日本传统色 - 煎茶",
    "description": "日本传统色「煎茶」，抹茶般的鲜绿色",
    "data": {
      "colors": ["#6A8E3A"],
      "englishName": "Sencha Green",
      "culturalOrigin": "日本传统色"
    }
  },
  {
    "id": "color-dunhuang-lapis",
    "type": "color_palette",
    "keywords": ["青金石", "lapis lazuli", "敦煌", "dunhuang", "深蓝", "sui dynasty"],
    "name": "敦煌色彩 - 青金石",
    "description": "敦煌壁画中的青金石色，隋代从阿富汗进口的珍贵蓝色",
    "data": {
      "colors": ["#1A236E"],
      "period": "隋代",
      "source": "阿富汗进口"
    }
  },
  {
    "id": "color-dunhuang-clay",
    "type": "color_palette",
    "keywords": ["赭石", "ochre", "敦煌", "dunhuang", "土红", "northern wei", "矿物颜料"],
    "name": "敦煌色彩 - 赭石",
    "description": "敦煌壁画中的赭石色，北魏时期的典型土红色",
    "data": {
      "colors": ["#8B4513"],
      "period": "北魏"
    }
  },
  {
    "id": "emotion-petrichor",
    "type": "emotion",
    "keywords": ["petrichor", "雨后", "泥土芬芳", "清新", "自然", "潮湿", "雨天", "雨后泥土"],
    "name": "Petrichor 雨后芬芳",
    "description": "雨后泥土散发的清新芬芳气息",
    "data": {
      "colors": {
        "approach": "Earth tones (browns, greens), fresh after-rain greens, damp soil colors"
      },
      "typography": {
        "h1": "Light weights (300-400), slight italic",
        "fonts": "Serif or rounded sans-serif"
      },
      "spacing": {
        "lineHeight": "1.9-2.0 (airy, fresh)"
      },
      "decorations": {
        "borders": "1px solid, subtle (earth-toned)",
        "background": "Warm off-white or very light green tint"
      }
    }
  },
  {
    "id": "emotion-golden-hour",
    "type": "emotion",
    "keywords": ["golden hour", "日落", "sunset", "温暖", "金色", "黄昏", "夕照", "傍晚", "golden"],
    "name": "Golden Hour 日落金山",
    "description": "日落时分的金色温暖光芒",
    "data": {
      "colors": {
        "approach": "Gold (#FFD700), warm orange (#FF8C00), pink gradients, deep yellow"
      },
      "typography": {
        "h1": "Warm serif (Georgia, Noto Serif SC) + letter-spacing 0.1em",
        "fonts": "Elegant serif"
      },
      "spacing": {
        "lineHeight": "1.7-1.8 (balanced)"
      },
      "decorations": {
        "background": "Warm golden gradient (linear-gradient(to bottom, #FFD700, #FF8C00))",
        "borders": "2px solid gold (#D4AF37)"
      }
    }
  },
  {
    "id": "emotion-deep-ocean",
    "type": "emotion",
    "keywords": ["deep ocean", "深海", "神秘", "blue", "dark blue", "深渊", "水蓝", "海洋"],
    "name": "Deep Ocean 深海神秘",
    "description": "深海中神秘莫测的蓝色世界",
    "data": {
      "colors": {
        "approach": "Deep navy (#0A192F), teal (#006D77), aquamarine (#7FFFD4)"
      },
      "typography": {
        "h1": "Thin weights (300) + wide letter-spacing (0.1-0.15em)",
        "fonts": "Light serif or thin sans-serif"
      },
      "spacing": {
        "lineHeight": "2.0+ (deep, spacious)"
      },
      "decorations": {
        "background": "Dark blue gradient (linear-gradient(to bottom, #0A192F, #1A236E))",
        "borders": "None or very subtle (1px transparent)"
      }
    }
  },
  {
    "id": "emotion-morning-fog",
    "type": "emotion",
    "keywords": ["morning fog", "晨雾", "迷雾", "mist", "朦胧", "清晨", "薄雾", "雾天"],
    "name": "Morning Fog 晨雾",
    "description": "清晨薄雾的朦胧柔美",
    "data": {
      "colors": {
        "approach": "Light grays (#D3D3D3, #E8E8E8), whites (#FFFFFF), soft blue tints"
      },
      "typography": {
        "h1": "Light weights (300-400) + slight letter-spacing (0.05em)",
        "fonts": "Light serif or sans-serif"
      },
      "spacing": {
        "lineHeight": "2.0+ (airy, misty)"
      },
      "decorations": {
        "background": "Fog effect (radial-gradient with rgba(255,255,255,0.8))",
        "borders": "None (invisible, misty)"
      }
    }
  }
];

const merged = [...colors, ...newEntries];
fs.writeFileSync('data/knowledge/colors.json', JSON.stringify(merged, null, 2));
console.log('Added', newEntries.length, 'entries');
console.log('Total colors:', merged.length);
