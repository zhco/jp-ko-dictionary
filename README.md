# 日韩词典 / 日韓辭典 / 일한사전

一个完全离线的日语-韩语双向词典应用，支持 PWA 安装和 Android APK 构建。

## 功能特性

- 完全离线使用，无需网络连接
- 日语 → 韩语 / 韩语 → 日语 双向查询
- 支持假名、汉字、韩文搜索
- 包含词性、读音、例句
- 查询历史记录（本地存储）
- PWA 支持，可安装到手机桌面
- 响应式设计，适配各种屏幕

## 技术栈

- HTML5 / CSS3 / JavaScript (Vanilla)
- Capacitor (Android 打包)
- Service Worker (离线缓存)

## 词典数据

包含约 400+ 条常用日语-韩语词汇对照，涵盖：
- 基础名词（家庭、学校、交通等）
- 动词（食べる、飲む、行く 等）
- 形容词（高い、寒い、楽しい 等）
- 副词、数词、代词等

## 本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/jp-ko-dictionary.git
cd jp-ko-dictionary

# 安装依赖
npm install

# 同步到 Android 项目
npx cap sync android

# 打开 Android Studio（或直接用 Gradle 构建）
npx cap open android
```

## 构建 APK

### 方法 1：使用 Android Studio
1. 打开 `android` 文件夹
2. 选择 Build → Build Bundle(s) / APK(s) → Build APK(s)
3. APK 文件将生成在 `android/app/build/outputs/apk/debug/` 目录

### 方法 2：命令行构建
```bash
cd android
./gradlew assembleDebug
```

构建完成后，APK 位于：
`android/app/build/outputs/apk/debug/app-debug.apk`

## 作为 PWA 安装

1. 在支持 PWA 的浏览器（Chrome、Edge、Safari）中打开应用
2. 点击地址栏右侧的"安装"按钮
3. 应用将安装到手机/电脑桌面，可离线使用

## 项目结构

```
jp-ko-dictionary/
├── www/                    # Web 应用源代码
│   ├── index.html         # 主页面
│   ├── css/
│   │   └── style.css      # 样式
│   ├── js/
│   │   ├── dictionary-data.js  # 词典数据
│   │   └── app.js         # 应用逻辑
│   ├── manifest.json      # PWA 配置
│   └── sw.js              # Service Worker
├── android/               # Android 项目（由 Capacitor 生成）
├── capacitor.config.json  # Capacitor 配置
└── package.json
```

## 许可证

MIT License

## 数据来源

词典数据基于常见日语词汇和对应韩语翻译手工整理。
