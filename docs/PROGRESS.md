# 开发进度

日期：2026-10-21（America/New_York）。

## Stage Completed

PHASE 0–2 已获确认；PHASE 3 已完成 UI 原型，等待用户审查。PHASE 4–11 未开始。

## Implemented

React + TypeScript + Vite + Tailwind CSS 本地原型；统一奶油白/深绿灰/深红设计系统。完成首页、全书目录、17 步地图、词卡、三层语法、原题提示/答案、Fun Fact、复习原型，以及词库/偏好/组件展示。五个代表性学习屏幕使用第 8 课真实样本，不声称是完整课程。

交互包括页面/步骤导航、地图弹窗与目标查看、词卡切换与会话收藏、解释展开、任意提示跳转、输入/自评切换保留草稿、答案/解释显示、基础浏览器音频试播与错误提示、原文展开、复习揭晓/评分推进、词库搜索、减少动画。

## Files Changed

package.json / package-lock.json / tsconfig.json / vite.config.ts / index.html；src/main.tsx、src/components/ui.tsx、src/style.css、src/data/prototype.json；scripts/check_phase3.mjs；docs/phase3 设计规范/测试报告与阶段归档；README、ROADMAP、DECISIONS、PROJECT_STRUCTURE、本记录。

## Testing

依赖安装、TypeScript 和生产构建通过。Playwright 在桌面 1440px、平板 768px、手机 390px 检查导航、地图、词卡、语法、习题、Fun Fact、复习、搜索、设置及目录；无页面横向溢出或 JavaScript 异常。截图已生成并视觉检查；修复词卡顺序与例句配对、手机导航裁切等问题。详见 docs/phase3/TEST_REPORT.md。

## How to Verify

`npm ci` 后 `npm run dev -- --port 5173`；在运行机器访问 http://localhost:5173/。`npm run build` 生成 dist。保持服务器运行后执行 `npm run test:ui`。当前云端预览未公开发布，不能把云端 localhost 当作用户电脑网址；可查看 artifacts/phase3 截图或本地运行。

## Known Issues

IPA 待验证；真实音频听感、完整语音与词形帮助未实现/验证。所有状态仅内存，刷新重置；无 IndexedDB、完整课程逻辑、自动评分、SRS 或备份。完整原题只展示 8.1/3 样本；地图为设计目标预览。未验证读屏器或跨浏览器真实设备。原型数据不是 PHASE 4 正式模型。

## Next Stage

等待用户决定是否调整 UI。明确批准后再进入 PHASE 4 内容模型、加载和校验；本次不提前开发。

## GitHub 源码交付补充

应用户要求推送至公开仓库 yiduya/french1，未启用 Pages。排除 PDF、artifacts、来源报告和 src/data/prototype.json。公开源码新增私人原型资料选择页，仅浏览器会话内读取，不上传；不是 PHASE 9 学习记录导入。无教材干净检出构建通过；浏览器验证错误文件拒绝、正确私人文件打开原型通过。仍停留 PHASE 3。
