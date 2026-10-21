# PHASE 3 — Design system

日期：2026-10-21（America/New_York）。仅 UI 原型；不代替完整课程、数据模型或学习系统。

## 视觉规范

| Token | Value | 用途 |
|---|---|---|
| Canvas | #f6f3ec | 奶油白页面背景 |
| Surface | #fffefa | 阅读卡片与弹窗 |
| Ink | #293d37 | 深绿灰正文/标题 |
| Accent | #943e3d | 主按钮、重点语法 |
| Supporting surface | #e9ede5 | 温和辅助信息 |
| Border | #dedfd5 | 轻量分隔 |
| Heading | Georgia / Times New Roman | 教材阅读感；无远程字体依赖 |
| Body | Arial / Helvetica / sans-serif | 英文/法语正文 |
| Body size | 15px / 1.6 | 宽松行距 |
| Display | 32–46px | 页面标题，按视口缩放 |
| Card heading | 23–34px | 内容层级 |
| Spacing | 8、12、16、24、32、48px | 间距体系 |
| Radius | 5–8px | 按钮/卡片 |

主操作单一、非必要统计退后、辅助段落可折叠。桌面侧栏，手机四个完整可见导航入口；小屏卡片单列。焦点以 3px 可见描边标识，主标题接受路由焦点但不显示装饰性外框。

## 组件与原型页面

`src/components/ui.tsx`：Button、Tag、Modal（原生 dialog）、Speech（仅基础试播）。
`src/style.css`：统一卡片、导航、输入、进度、答案、提示选项、折叠解释、Fun Fact、复习评分与响应式样式。
应用内 Design system 页面展示颜色、按钮、输入、进度条、折叠项及弹窗。

原型涵盖 Dashboard、全书 Course Overview、17 步 Lesson Map、Vocabulary Card、Grammar Explanation、Exercise、Fun Fact、Review，并提供三词 Vocabulary Library 和两项 Preferences 控件。

## 内容与状态边界

原书来源样本独立放在 `src/data/prototype.json`：50 个原课名、17 个设计目标、3 个真实词汇、8.1/3 原题答案及 Flowers and Colors。不是 PHASE 4 正式 schema。新增解释清楚标记 Additional Explanation，原文标记 Textbook Content。词汇卡 IPA 显示待核验，不填伪造音标。

5 个代表性学习屏幕不等于 17 微课完整实现。地图只显示每步目标，明确告知样本范围。未构建的章节只列目录，不显示虚假完成率。原题只有一个样本，不把未导入题目标记为完成。

进度、书签、练习草稿、复习评分、偏好仅内存会话状态；刷新即重置。Review 只演示揭晓及评分反馈，没有间隔重复调度。Interactive 输入仅参考比较，不自动判分。没有付费 API、登录或服务器数据库。

基础语音按钮只在可用法语系统声音存在时调用 Web Speech API，并提示缺声音/播放失败；不构成完整语音选择、IPA、句内查词或所有片段发音系统。音频质量/系统差异留到 PHASE 6。
