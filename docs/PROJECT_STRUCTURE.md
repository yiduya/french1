# 项目结构

实际根目录：`/workspace/french1`。

## PHASE 0 已创建

```text
README.md
.gitignore
docs/
  PROJECT_SPEC.md
  ROADMAP.md
  DECISIONS.md
  CONTENT_GUIDELINES.md
  PROJECT_STRUCTURE.md
  ENVIRONMENT.md
  INPUT_INVENTORY.md
  PROGRESS.md
scripts/check_phase0.py
inputs/pdf/.gitkeep
inputs/audio/.gitkeep
inputs/screenshots/.gitkeep
```

## 未来结构方案（尚未创建/实现）

```text
src/
  app/                 # 路由、应用入口
  components/          # 统一设计组件
  features/            # dashboard/course/lesson/vocabulary/grammar/exercises/review/settings
  content/             # 加载器与类型，不包含教材硬编码
  storage/             # IndexedDB、迁移、备份
  speech/              # TTS 与本地音频适配
content/               # 私有课程及词汇/语法/例句/习题/答案/Facts/来源数据
schemas/               # PHASE 4 schema
scripts/pdf/           # PHASE 1 提取工具
scripts/validate/      # PHASE 4+ 内容验证
artifacts/             # 私有抽取与质量报告产物
public/audio/          # 未来经许可的本地音频；打包前单独审查
tests/                 # unit/component/e2e
```

课程、用户数据、原始输入分别管理；不把整个 inputs 复制到 public。未来目录以阶段需要逐步建立，不用空壳目录冒充已完成功能。

## PHASE 1 新增实际目录

`docs/phase1/`：结构、目录、内容/题目索引、提取方案、质量、第 8 课报告及阶段 0 归档。
`scripts/pdf/`：结构分析、第 8 课初提脚本；`scripts/check_phase1.py`：本阶段验证。
`artifacts/phase1/`：受 Git 忽略的私有逐页文字、bbox、索引、初提和人工图片转录；不是后续课程运行时数据。

## PHASE 2 新增实际目录

`docs/phase2/`：教学设计、词汇依赖、逐题分配、提示/反馈设计、设计映射 JSON、评审报告和阶段 1 归档。`scripts/check_phase2.py` 检查设计覆盖与依赖，不是运行时课程校验器。

## PHASE 3 实际新增

项目根：package.json/锁文件、Vite/TypeScript 配置与 index.html。src/main.tsx（页面原型）、src/components/ui.tsx（共享组件）、src/style.css（设计系统）、src/data/prototype.json（来源样本）。scripts/check_phase3.mjs 用 Playwright 验证交互；docs/phase3 保存规范与结果；artifacts/phase3 保存私人截图。dist 为本地构建输出，不上传。

## PHASE 4 实际新增

`src/content/`：正式模型、验证、加载/查询与开发者检查界面；`src/user-data/`：分离的数据约定；`schemas/`：导出格式；`tests/content/`：合成契约测试；`scripts/validate/`：CLI。`content/private/lesson8-sample.json`：不公开的真实教材样本。`docs/phase4/`：模型、运行与测试说明。
