# 项目需求基线

日期：2026-10-20（America/New_York）。本文件是执行用需求索引，不替代用户完整规格，不删减其要求。当前授权仅 PHASE 0。

## 1. 开发与真实性原则

严格按 PHASE 0–11 顺序；每阶段报告实现、文件、测试、验证方法、问题、下一阶段并更新 PROGRESS，等待确认。禁止提前生成全书、跳过单课验证、用静态演示或假按钮冒充功能。完整 PDF 是唯一教材主体；保留原章号与标题、词汇、语法、例句、全部练习编号和题号、Fun Facts、答案及对应关系。提取不清、无法识别或答案不确定一律待核对，不补造。用户提供的第 8 课描述尚未与 PDF 核验。

## 2. 语言和教学

网站导航、释义、解释、助记、反馈、设置均英文；学习材料法语配英文，不提供中文界面。文档可中文。遵循 Discover → Learn → Understand → Practice → Connect → Review，支持循环。Course → Lesson → Micro Lesson → Learning Activity；章对应教材，微课围绕一个知识点、通常 0–5 新词及 1–3 微练习，不机械拆分；活动 ID 稳定唯一。

## 3. 词汇（规格 §6–7）

卡片包括法语、经校验 IPA、词性、英文义、正常/慢速发音、例句与发音、助记、语法/性别提示、关联词、Add to Review。名词尽量含冠词、性别、复数、例句与性别记忆；动词含原形、类型、当前所需变位和搭配，不提前要求全部时态。Meaning Memory 与 Grammar Memory 分开，优先同源词、构词、词尾、反义/近义、搭配、可靠词源；无可靠助记可省略。Core / Supporting / Previously Learned / Optional 分类；默认只有 Core 加入新词，其他可查义及手动复习；跨章同词共享记录。

## 4. 语法、练习和趣味知识（§8–11）

Essential 默认简明，Explanation 和 Deep Dive 逐级折叠。知识点后立即 1–3 题，按内容选择选择、填空、配对、变位、判断、补句、翻译、听辨；允许直接看答案，不以连续正确阻塞继续。
原书练习保留 No Hint、Hint 1 语法方向、Hint 2 关键词、Hint 3 框架、Show Answer、Explain Answer，各层可直达。Self-check 可纸上作答并自行 Correct/Incorrect；Interactive 输入并对适合题型评分，随时切换。支持单题/整组揭晓、重做、错题、原书顺序模式。开放翻译不以字符串完全一致判断，支持合理变体或自评；判断题解释依据。
Fun Facts 分类 Language Facts / Culture Facts / Memory Tricks；通常 50–120 英文词或更短，含标题、相关法语与发音、可选互动、来源，贴近知识点放置，不增加大量无关阅读。

## 5. 发音和即时帮助（§12–13）

所有法语单词、短语、句子（包括题目、答案、Fun Facts、复习）有发音入口；默认 fr-FR，正常/慢速/重复/逐句、可选法语语音、状态与失败提示、请求切换。Web Speech API 优先，预留本地音频；不保证跨设备一致或默认离线。IPA 必须独立校验；按需讲 liaison、enchaînement、élision。
点击可识别词打开不打断流程的帮助：原形、IPA、英文义、词性、当前形式、发音、说明、Add to Review。词形明确关联原形，无法可靠分析不猜测。

## 6. 复习和记录（§14、18–20）

Quick Review 记录首次学习、复习历史、熟练度、正误、下次时间、困难词；卡片可渐进到回忆、听辨、变位、性别、填空。采用成熟可验证算法，Again/Hard/Good/Easy；揭晓不等于记住，每日数量可限。自动保存并恢复位置；Vocabulary Mastery / Grammar Progress / Exercise Completion 分开。
本地优先，无登录、云数据库或付费 AI 依赖。IndexedDB 用户数据与版本化课程分离；备份导入导出、校验、迁移，不因更新删除记录。跨设备尺寸适配不等同自动同步。
Content：courses、lessons、microLessons、vocabulary、grammarPoints、exampleSentences、exercises、answerKeys、funFacts、audioAssets、sourceReferences。
User Data：lessonProgress、activityProgress、vocabularyProgress、reviewHistory、exerciseAttempts、bookmarks、preferences。
稳定 vocabularyId/exerciseId/activityId；题目保留原章/练习/题号、来源位置及答案来源。未来自动验证重复 ID、悬空引用、缺答案/字段/翻译/发音、未连接步骤、原题遗漏及答案错配。

## 7. 页面与体验（§15–17）

奶油白、深灰/深蓝正文、克制深红、清晰排版留白；轻量动画可关闭，避免高饱和渐变、跳动、过度卡通、装饰 Emoji、密集工具栏与积分排行榜。
Dashboard：Continue Learning、Quick Review、Current Lesson、Today's Progress、Course Progress，统计不主导。
Course Overview：全章及各类进度；Lesson：标题/进度/地图、一个主要任务、Previous/Continue、按需帮助，避免整课长滚动。
Vocabulary Library：搜索、按课/词性/掌握度筛选、收藏和复习历史。Review 简洁。Settings：语音、速度、新词批量、每日复习上限、练习模式、动画、导入导出。
活动几分钟可完成，可跳过、随时看答案、恢复上次位置、不强制打卡或先背完词、遗忘不惩罚；键盘可用、焦点清晰、手机与桌面可读。

## 8. 样板与最终验收

第 8 课 Regular -ir Verbs 为首个样板，范围必须由 PDF 核实。用户指出 Exercises 8.1–8.4、Everyday Words、Flowers and Colors；不能当作已核验完整清单。非所有 -ir 动词都属同一规则类型。先完成教学依赖设计、UI、数据、词汇、发音、语法、原题、记录和端到端验证，再经明确批准批量每次 2–4 章。
最终交付源码、运行网站、全部结构化课程、PDF 工具、验证工具、备份功能、说明、测试与限制。能持续完整学习全书、轻松查词听音、练习和复习，不依赖付费服务。不得公开发布或重新分发教材内容。

优先级依次为准确性、完整性、学习顺序、教学质量、发音、答案、记录可靠性、操作体验、视觉、非必要功能。不得编造答案/IPA、丢编号、混淆新增与原文、强背全部词、强制打卡、未获准收费接入、内容散落组件、删数据或虚报完成。
