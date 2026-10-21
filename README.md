# Practice Makes Perfect: Basic French

个人学习项目。当前 PHASE 3 UI 原型已完成，等待界面审查；不是完整学习系统。网站与教学文案英文，教材法语。

## GitHub 公开源码说明

本仓库只发布项目源码，不发布教材。原 PDF、抽取工件、PHASE 1/2 来源报告和 `src/data/prototype.json` 均被排除。公开源码可独立构建。未附教材数据时，启动页允许选择你自己保存的私人 `prototype.json`；文件只读入浏览器本次会话，不上传。也可在本机将文件放回 `src/data/`。这是原型资料载入，不是未来学习进度导入功能。

GitHub 仓库地址不是网站地址；本次未启用 GitHub Pages。不要把含教材的构建结果公开部署。

## 运行原型

```sh
npm ci
npm run dev -- --port 5173
```

在运行命令的同一台机器打开 http://localhost:5173/。云端需可用的端口转发，本次没有公网部署。

```sh
npm run build
# 保持开发服务器运行，另一个终端执行（需已安装 Chromium）：
CHROMIUM_PATH=/usr/bin/chromium npm run test:ui
```

开始页面可进入五个学习屏幕；侧栏可浏览目录、词库和复习；Lesson map 查看 17 个教学目标。所有状态仅本次会话，刷新即重置。没有数据库/登录/付费 API。IPA、完整发音支持、自动评分、间隔重复与备份尚未实现。

## 文档与来源

- 当前进度：docs/PROGRESS.md。
- 需求及阶段边界：docs/PROJECT_SPEC.md、docs/ROADMAP.md。
- PHASE 1：docs/phase1/STRUCTURE_REPORT.md。
- PHASE 2：docs/phase2/LESSON8_TEACHING_DESIGN.md。
- PHASE 3：docs/phase3/DESIGN_SYSTEM.md、docs/phase3/TEST_REPORT.md。
- 截图：artifacts/phase3/。

原教材与抽取工件放在 inputs/ 和 artifacts/，被 Git 忽略；这些私人文件需另行备份。src/data/prototype.json 和 dist 也含私人教材样本，不得公开发布或重新分发。本次没有注册站点或上传部署。

Python 结构检查：`python scripts/check_phase0.py`、`python scripts/check_phase1.py`、`python scripts/check_phase2.py`，需要 PyMuPDF 和原 PDF/工件。提取脚本及人工表格依赖见阶段文档。
