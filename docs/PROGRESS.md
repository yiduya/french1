# 开发进度

日期：2026-10-21（America/New_York）。

## Stage Completed

PHASE 0–3 已获确认继续；PHASE 4 已完成，等待用户确认。PHASE 5–11 未开始。GitHub Pages 首次开关仍受集成权限阻塞，未宣称已上线。

## Implemented

内容 v1 模型、独立用户数据格式、Zod + JSON Schema、关系校验器、只读查询仓库、原子加载/错误报告、浏览器独立内容检查页面。词汇跨课复用、微课顺序可调整、原题编号查询及来源/新增解释分离。法语片段关联发音配置；IPA 待校验明确为 null。

少量第 8 课真实私有样本：3 词、1 语法点、3 例句、3 原题/答案、1 Fun Fact 摘录、13 法语/音频配置；独立原题清单仍列全 34 题。未提前完成整课或完整词汇模块。PHASE 3 样本保留，正式 v1 内容通过新的加载模块读取。

## Files Changed

src/content/schema.ts、validate.ts、load.ts、ContentInspector.tsx；src/user-data/schema.ts；schemas/content-v1.json 和 user-data-v1.json；scripts/validate/、scripts/pdf/build_phase4_sample.py、scripts/check_phase4_sample.py、scripts/check_phase4_ui.mjs；tests/content/；src/data/prototype-copy.ts 与原型入口；docs/phase4/；依赖/锁文件、CI、README、决策/路线/结构及本进度。

真实教材样本 content/private/lesson8-sample.json 与 artifacts 检查截图不公开提交。公开源码干净检出的 32 项测试与构建已通过，代码更新推送至 yiduya/french1。

## Testing

32 项内容契约测试 PASS。独立 PDF/初提对照 PASS。浏览器有效读取、错误拒绝并保留旧内容、移动端检查 PASS。PHASE 3 UI 回归 PASS。TypeScript、schema 导出及构建 PASS。真实样本 0 error / 57 warnings（含 31 道未导入题、3 项待核验 IPA）；strict 模式预期拒绝发布就绪声明。详见 docs/phase4/TEST_REPORT.md。

## How to Verify

`npm ci`；`npm run test:content`；`npm run content:validate -- content/private/lesson8-sample.json`。需要私人文件时运行 `python scripts/pdf/build_phase4_sample.py`（依赖本地 Phase 1 工件）。
启动 `npm run dev -- --port 5173`，在运行机器打开 `http://localhost:5173/?view=content`，选择结构化样本。公开源码不含样本，可独立运行合成测试与构建；不把本机 localhost 当远程网址。

## Known Issues

未核验 IPA、新增说明待教学审核、全书覆盖待后续批次。发音配置存在不代表实际音质已验证。单包上限 5 MiB，跨包加载待以后设计。用户数据只有格式，无存储、迁移或调度；没有删除任何历史记录。旧 Phase 3 原型格式与 v1 不通用，检查器明确分开。GitHub Pages 仍需仓库管理员选择 GitHub Actions 作为 Source。

## Next Stage

用户确认后进入 PHASE 5：按获批教学顺序实现第 8 课完整词汇学习模块及完整词汇数据；本次停止，不提前开发。
