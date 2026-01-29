# 🌊 MuseFlow | 浮光 · 掠影

> **不仅仅是编辑器，更是你的 AI 设计伙伴。**
> 
> *Not just an editor, but your AI co-pilot for design and creation.*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38bdf8.svg)


## 💡 产品哲学 (Philosophy)

MuseFlow 的诞生，源于对现有内容生产工具的反思。我们不把它定义为一款单纯的“编辑器”，而是一个**激发灵感与放大价值的创造引擎**。

### 1. 🎲 随机性与创造的魅力
市面上的工具大多提供千篇一律的模版，导致内容同质化严重。MuseFlow 引入了 AI 的“随机性”——你只需给出一个模糊的感觉（如“雨后的东京街头”），AI 就能为你生成独一无二的视觉语言。这种**不可预测的惊喜**，是创作过程中最迷人的部分。

### 2. ⚖️ 复利思维与内容杠杆
写作是线性的，但分发应该是指数级的。MuseFlow 是**全平台分发雏形**的探索：
*   **一段原始素材（Raw Material）**：是你思想的核心。
*   **多维形态转化（Polymorphic Transformation）**：
    *   想发**公众号**？它通过 CSS 注入变为优雅的图文排版。
    *   想发**小红书**？它将长文拆解为逻辑连贯的视觉卡片。
*   **杠杆效应**：通过 AI 设计引擎，让同一份内容资产，在不同生态中都能以最完美的形式呈现，实现影响力的最大化。

## ✨ 核心特性 (Features)

### 1. 🎨 双模渲染引擎
*   **微信公众号模式**：
    *   所见即所得的 375px 移动端仿真预览。
    *   自动将 Markdown 编译为带内联样式（Inline CSS）的 HTML，完美绕过微信后台限制。
    *   支持一键复制，格式不乱，样式不丢。
*   **小红书卡片模式**：
    *   智能将长文拆解为 4-8 张逻辑连贯的竖屏图文笔记卡片。
    *   支持多种布局：封面、清单、金句、总结。
    *   一键导出高清 PNG 图片组。

### 2. 🤖 AI 灵感工坊 (BYOK)
*   **文生主题**：输入“赛博朋克霓虹”或“清晨的森林”，AI 实时生成全套 CSS 配色方案。
*   **图生主题**：上传一张你喜欢的照片，AI 自动提取其色彩心理学特征，应用到你的文章排版中。
*   **智能格式清洗**：一键整理从飞书、Word 或网页复制来的杂乱文本。

### 3. 🔒 隐私与自由
*   **Bring Your Own Key (BYOK)**：我们不内置 AI 模型，支持用户配置自己的 API Key。
*   **多模型支持**：完美支持 **OpenAI ** 以及国内主流大模型（**DeepSeek 深度求索**、**Kimi 月之暗面**、**通义千问**等）。
*   **本地存储**：你的草稿、自定义主题、API Key 均加密存储在浏览器的 LocalStorage 中，不经过任何中间服务器。

## 👨‍💻 关于作者 (Author)

本项目由 **[反时钟效率笔记]** 设计与维护。

我们专注于 **个体效率**、**思维工具** 与 **数字美学** 的探索。
如果你喜欢这个项目，或者想获取更多AI相关的探索，欢迎关注我的公众号。

<div align="center">
  <img src="./assets/qrcode.jpg" alt="反时钟效率笔记" width="180" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
  <br/>
  <br/>
  <p>👆 扫码关注，让思考慢下来，让效率快起来。</p>
</div>

## 🚀 快速开始 (Quick Start)

### 环境要求
*   Node.js >= 18
*   npm 或 yarn

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/linyuan3421/museflow---ai-wechat-editor.git

# 2. 进入目录
cd museflow

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可开始创作。

## ⚙️ 模型配置指南

为了使用 AI 功能（如生成主题、清洗格式），你需要配置 API Key。

1.  点击左侧栏顶部的 **“设置” (⚙️)** 图标。
2.  选择你偏好的服务商预设。
3.  输入你的 API Key。
    *   *OpenAI:* `https://platform.openai.com/api-keys`
    *   *DeepSeek:* `https://platform.deepseek.com/api_keys`
4.  点击保存。配置将仅保存在你的本地浏览器中。

## 🛠️ 技术栈

*   **Frontend**: React 18 + TypeScript + Vite
*   **Styling**: Tailwind CSS
*   **Markdown Engine**: React Markdown (Remark/Rehype)
*   **Export**: HTML2Canvas (for Images)
*   **AI Integration**: Native Fetch (OpenAI Compatible Interface)

## 🤝 贡献 (Contributing)

欢迎提交 Issue 或 Pull Request！
如果你喜欢这个项目，请给它一个 ⭐️ Star，这对我意义重大。

## 📄 开源协议

MIT License. 

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/linyuan3421">反时钟效率笔记</a></p>
  <p>让每一次记录，都如浮光掠影般美好。</p>
</div>