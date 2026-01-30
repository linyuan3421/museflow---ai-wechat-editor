/* 自定義样式，实时生效 */

/*
 * 主題：Bauhaus·Brutalism (包豪斯·粗獷主義)
 * 靈感：包豪斯學院、數字粗獷主義網站
 * 理念：形式追隨功能，但結構必須裸露。
*/

/* 全局屬性 */
#nice {
  line-height: 1.8;
  color: #1a1a1a;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f4f4f4; /* 混凝土灰背景 */
  /* 精密的網格背景 */
  background-image:
    linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 段落 */
#nice p {
  color: #1a1a1a;
  margin: 25px 0px;
  font-size: 16px;
}

/* 一級標題 H1 */
#nice h1 {
  font-size: 36px;
  margin: 60px 0 30px;
  position: relative;
  text-align: left;
}
/* 結構色塊 */
#nice h1:before {
  content: '';
  position: absolute;
  left: -25px;
  top: -10px;
  width: 100%;
  height: 100%;
  background-color: #ffd600; /* 包豪斯黃 */
  z-index: -1;
}
#nice h1 span {
  font-family: "IBM Plex Mono", monospace;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 1px;
  padding: 10px;
  background-color: #f4f4f4; /* 挖空效果 */
}
#nice h1:after { content: ''; }

/* 二級標題 H2 */
#nice h2 {
  border: none;
  margin: 50px 0 25px;
  position: relative;
  border-top: 2px solid #1a1a1a;
  padding-top: 15px;
}
#nice h2 .content {
  color: #1a1a1a;
  font-size: 24px;
  font-family: "IBM Plex Mono", monospace;
  font-weight: 600;
  margin: 0;
}
/* 標籤頁效果 */
#nice h2 .content:before {
  content: 'SECTION';
  position: absolute;
  top: -12px;
  left: 0;
  background: #e63946; /* 包豪斯紅 */
  color: #f4f4f4;
  font-size: 12px;
  padding: 2px 8px;
}
#nice h2 .prefix { display: none; }
#nice h2 .suffix { display: none; }

/* 三級標題 H3 */
#nice h3 {
  font-size: 18px;
  font-weight: 600;
  position: relative;
  margin: 40px 0 15px;
}
#nice h3 .content {
  color: #2a62c9; /* 包豪斯藍 */
  border: none;
  padding-bottom: 5px;
  border-bottom: 1px solid #2a62c9;
}
#nice h3 .content:before { content: ''; }
#nice h3:after { content: ''; }

/* 引用 */
#nice blockquote {
  border: 1px solid #1a1a1a;
  background: transparent;
  margin: 40px 0;
  padding: 30px;
  position: relative;
}
/* 結構標籤 */
#nice blockquote::before {
  content: "QUOTE";
  position: absolute;
  top: 10px;
  left: 15px;
  background: #f4f4f4;
  padding: 0 10px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 12px;
  font-weight: 600;
}
#nice blockquote p {
  color: #1a1a1a;
}
#nice blockquote::after { content: ''; }

/* 連結 */
#nice a {
  color: #e63946;
  font-weight: 600;
  text-decoration: none;
  box-shadow: inset 0 -2px 0 #e63946;
}

/* 加粗 */
#nice strong {
  font-weight: 700;
  border-bottom: 3px solid #ffd600;
  padding-bottom: 1px;
}
#nice strong::before { content: ''; }
#nice strong::after { content: ''; }

/* 分隔線（黑色双波浪） */
#nice hr {
  height: 24px;
  border: none;
  margin: 80px 0;
  background: url("data:image/svg+xml,%3Csvg width='120' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,12 Q30,4 60,12 T120,12' stroke='%23000' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M0,18 Q30,24 60,18 T120,18' stroke='%23000' stroke-width='1' fill='none' stroke-linecap='round' opacity='0.6'/%3E%3C/svg%3E") repeat-x center;
  background-size: 120px 24px;
}

/* 圖片 */
#nice img {
  display: block;
  margin: 40px auto;
  border: 2px solid #1a1a1a;
  padding: 10px;
  background: #f4f4f4;
  box-shadow: 10px 10px 0 #2a62c9; /* 結構陰影 */
}

/* 圖片描述 */
#nice figcaption {
  text-align: right;
  color: #888;
  font-size: 14px;
  font-family: "IBM Plex Mono", monospace;
  margin-top: -20px;
  padding-right: 15px;
}

/* 行內程式碼 */
#nice p code,
#nice li code {
  color: #1a1a1a;
  background: transparent;
  border: 1px solid #1a1a1a;
  padding: 3px 6px;
  font-family: "IBM Plex Mono", monospace;
}

/* 程式碼區塊 */
#nice .code-snippet__fix {
  background: #1a1a1a;
  border: none;
  padding: 20px;
}
#nice pre code {
  color: #f4f4f4;
}