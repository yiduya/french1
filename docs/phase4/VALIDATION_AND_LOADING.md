# 校验与内容读取

## 运行

```sh
npm ci
npm run content:schema
npm run test:content
npm run content:validate -- content/private/lesson8-sample.json
npm run content:validate -- content/private/lesson8-sample.json --strict
```

最后一个命令预期退出 1：样本存在明确待核对项和未导入原题，不适合标记为完整发布。
普通模式：结构无 error 可读取，warnings 仍返回并展示。退出 0 = 结构通过，不等于语言审核或整课完成。退出 1 = 结构错误或 strict 模式存在 warning。退出 2 = 未指定文件/无法读文件。

真实样本重建（需要本地私人 PHASE 1 工件）：

```sh
python scripts/pdf/build_phase4_sample.py
python scripts/check_phase4_sample.py
```

仅转换 3 个表内词、3 道原题和少量语法/例句/Fun Fact。不会生成全书、IPA、额外原书答案或完整第 8 课。

## 错误机制

第一层 Zod schema 校验字段、类型、词性分支、必需翻译、来源、IPA 状态、未知字段和版本。导出 `schemas/content-v1.json`、`schemas/user-data-v1.json` 便于编辑器检查；JSON Schema 无法表达的 refinements 和跨实体关系必须通过 TypeScript 验证器，不能只靠编辑器绿灯。

第二层检查全局 ID、悬空引用、父子归属、活动唯一连接、词汇身份去重、先修循环/顺序、题答双向关系及原题身份、发音与文本对应、重复提示、正确选项、源页/bbox、原题清单遗漏。

样本允许有覆盖 warning；complete 声明下漏题为 error。题目引用不存在的答案、空答案均为 error，不用编造占位答案使其通过。未确定的内容可以留在提取工件中；原题进入可加载内容前需要有效参考答案。

每个问题返回 severity/code/path/message，便于定位。错误不返回可用仓库；浏览器检查器仅在完整验证成功后替换当前内容，失败保留此前仓库。没有静默修复、重编号或删数据。

## 读取 API

`loadContent(jsonText)` → `{ok, report, content?}`。内容仓库提供：

- snapshot：副本，调用方修改不污染仓库。
- getVocabulary：按全局词 ID 查询。
- getMicroLessons：按 lesson 的显示顺序返回。
- findOriginalExercise：按章号、原练习号、题号查找。
- getAnswer：按 exerciseId 查答案。
- getPronunciation：返回文本及配置，不擅自生成 IPA 或调用 TTS。

## 浏览器检查

`npm run dev -- --port 5173`，在运行机器打开 `http://localhost:5173/?view=content`，选择私人结构化样本。也可从 Design system → Inspect structured content 进入。独立开发者页面不混入学习流程，不引入服务器或上传请求。该文件不是学习记录备份，不能用来恢复学习进度。

保留服务器运行，另一个终端执行 `node scripts/check_phase4_ui.mjs`；需要已有 Chromium 与私人样本。公开 CI 只执行合成契约测试和构建，不依赖教材。
