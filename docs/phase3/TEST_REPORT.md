# PHASE 3 — Tests and verification

日期：2026-10-21（America/New_York）。

## 已执行

- `npm install --no-audit --no-fund`：依赖安装完成，生成 package-lock.json。
- `npm run build`：TypeScript 类型检查、Vite 生产构建通过。
- `npm run test:ui`：系统 Chromium + Playwright，1440px 桌面、768px 平板、390px 手机。
- 检查 Dashboard、5 个学习步骤、地图选择/关闭、词卡切换/会话收藏、语法折叠、任意层级提示、答案解释、模式切换保留草稿、Fun Fact 展开、复习评分推进、词库搜索、偏好、50 课目录和 10 组分段复习（另列总复习）。
- 窄屏无横向页面溢出；测试旅程无 JavaScript 异常。截图存于 artifacts/phase3。
- 基础语音试播/无语音提示路径接受测试；没有实际听音验证。
- 已视觉查看桌面首页、手机首页与练习页截图；据此把手机导航改为四个完整入口。

## 修复记录

- 自动测试选择器与实际可访问名称中的空格不符：修复测试定位。
- 原表词序与教学例句序不一致：改为 finir、choisir、réussir，与对应例句匹配。
- 搜索无结果判断统一大小写。
- 补充颜色词关系的 Additional Explanation 标签。
- 去除程序聚焦标题产生的大边框，保留交互控件键盘焦点。
- 手机横向导航改为四列，避免最后入口被裁切。

## 验证范围限制

未测试屏幕阅读器、所有浏览器/实体手机、真实音频输出、完整课程、IPA、持久化、复习算法或导入导出。原型允许较长答案展开后滚动，但不展示整课连续长页。不能把原型测试当作 PHASE 10 端到端课程验收。

## 如何运行

```sh
cd /workspace/french1
npm ci
npm run dev -- --port 5173
```

在运行命令的同一台机器浏览器打开 http://localhost:5173/ 。云环境的 localhost 不是用户电脑上的 localhost；本次未发布公网网址，远程查看需环境提供端口转发，或把项目带到本机运行。可先查看 artifacts/phase3 的截图审查视觉。

```sh
npm run build
# 保持开发服务器运行，再开另一个终端：
CHROMIUM_PATH=/usr/bin/chromium npm run test:ui
```

UI 测试使用已有 Chromium；其他机器指定其浏览器可执行文件路径。构建文件在 dist/。包含个人教材样本，不能将 dist 或源数据公开部署。
