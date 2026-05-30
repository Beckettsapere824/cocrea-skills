# CoCrea Skills

> 用「方法 / 工具 / 护栏」三层，扬长避短地增进每个人的创造力——一个有立场的中文创意 Skills 库。

CoCrea 不造编排引擎，造**内容**。这里的每一个 skill 都是一份 [Anthropic SKILL.md](https://code.claude.com/docs/en/skills)——
中文优先、带学科判断力、敢说「不」。你自带的 AI agent 直接加载它们，orchestration 由大模型自己免费完成。

零后端、零算力、零安装门槛。一行命令，让你的 AI 瞬间获得「看问题的方法 + 做事的工具 + 拦错的护栏」。

---

## 创意三层飞轮

一切围绕唯一核心——**创意**。不按学院分科，按**认知功能**分三层：

```
                    ┌──────────────────────────┐
                    │   核心：CREATIVITY 创意    │  ← 唯一目的
                    │   扬长避短地增进每个人的    │
                    │   一般创造 + 跨学科创造     │
                    └──────────────────────────┘
                               ▲
        ┌──────────────────────┼──────────────────────┐
   ① 方法 (lens)          ② 工具 (craft)         ③ 护栏 (guardrail)
   理解框架               可调用的做法            认知矫正/教育
   "教你看"               "教你做"                "拦你别错"
```

| 层 | 目录 | 一句话 | 已上线示例 |
| :--- | :--- | :--- | :--- |
| ① **方法 `lens`** | `skills/lens/` | 教你**看懂**被普遍误解的底层概念，强调可迁移 | 第一性原理、JTBD、注意力经济、机会成本、复利、贝叶斯思维 |
| ② **工具 `craft`** | `skills/craft/` | 教你**做出**东西，可调用的做法/工具 | MVP 裁剪、冷启动、钩子设计、简历改写、费曼技巧、主动回忆、决策矩阵 |
| ③ **护栏 `guardrail`** | `skills/guardrail/` | **拦**你别犯错，认知矫正/劝退 | 反过度工程、反追热点、反沉没成本、反虚荣指标、反低效勤奋 |

> **判断尺：方法教你「看」，工具教你「做」，护栏拦你「别错」。**

`skills/packages/` 放跨三层的 **Skill 包**（一套创意体系，自带推荐顺序）；
`skills/meta/` 放降低门槛的杠杆 skill（`skill-creator` / `skill-finder`）。

---

## 当前库存（5 个种子包 / 25 skill / 跨三层）

> 机器可读索引见 [`CATALOG.json`](CATALOG.json)（由脚本自动生成，`skill-finder` 的数据源）。

| 包 | 解决什么 | 含 skill |
| :--- | :--- | :--- |
| **founder-anti-patterns** | 创业/做产品避坑 | first-principles · jtbd / mvp-scoping / anti-over-engineering |
| **content-cold-start** | 内容创作冷启动 | attention-economy · jtbd / hook-design · cold-start-first-1000 / anti-trend-chasing · anti-vanity-metrics |
| **career-positioning** | 求职/转行定位 | opportunity-cost · jtbd / positioning-statement · resume-rewrite / anti-mass-application · anti-credential-anxiety |
| **learn-how-to-learn** | 学习/备考方法 | compounding / feynman-technique · active-recall / anti-collection-hoarding · anti-fake-diligence |
| **life-decisions** | 个人重大决策 | bayesian-thinking · opportunity-cost / decision-matrix / anti-sunk-cost · anti-analysis-paralysis |

> 原子化复用：`jtbd` 被 3 个包复用、`opportunity-cost` 被 2 个包复用——一个好 lens 跨多包复用，不重造。
> 库里还有两个杠杆 skill：`cocrea-skill-creator`（造）+ `cocrea-skill-finder`（找）。

---

## 安装（一行订阅）

本仓库即一个 [Claude 插件市场](https://code.claude.com/docs/en/plugin-marketplaces)。在你的 agent 里：

```
/plugin marketplace add Beckettsapere824/cocrea-skills
```

订阅后，对你的 agent 说「帮我看看我这个想法」，它会自动调用匹配的 skill。

---

## 如何贡献

我们要的不是「又一个平庸的 skill」。CoCrea 的护城河是**判断力 + 跨学科迁移**，不是数量。

最简单的方式：在你的 agent 里加载 [`skills/meta/cocrea-skill-creator`](skills/meta/cocrea-skill-creator/SKILL.md)，
对话式把你的方法/工具/避坑经验生成为合规 SKILL.md，再提 PR——它内置了下面的全部质量红线。
找不到需要的 skill？先用 [`cocrea-skill-finder`](skills/meta/cocrea-skill-finder/SKILL.md) 检索；没有，就用 creator 造一个。

### 质量红线（不可退让）

- **必须有 `## 立场` 段**——明确这个方法什么时候有用、什么时候误导人。无立场不录入。
- **`lens` 层必须写「可迁移到哪」**（`cocrea_transfer`）——跨学科是灵魂，缺则不合格。
- **`craft` 层不做硬科研 / 硬开发**——避开英文红海，服务非工程师创意者。
- **`guardrail` 层不得变成「鼓励多做」**——那背叛了这一层的存在意义。
- **中文优先**——稀释中文 = 稀释护城河。

完整规范内置在 [`cocrea-skill-creator`](skills/meta/cocrea-skill-creator/SKILL.md) 里（加载它，它会逐步带你写合规的 skill）。

---

## 本地工具链

唯一的代码是 catalog 生成器——扫描所有 SKILL.md / PACKAGE.md 的 frontmatter，生成机器可读的 `CATALOG.json`（`skill-finder` 的数据源）。

```bash
npm install
npm run catalog        # 生成 CATALOG.json
npm run catalog:check  # 校验是否最新（CI 用，有漂移则失败）
```

每次 PR 由 [`.github/workflows/catalog.yml`](.github/workflows/catalog.yml) 自动校验 catalog 是否与内容同步。

---

## 仓库结构

```
cocrea-skills/
├── .claude-plugin/
│   ├── marketplace.json    # Claude 插件市场清单（仓库 = 市场）
│   └── plugin.json         # 插件元数据
├── CATALOG.json            # 自动生成的机器可读索引（勿手改）
├── scripts/
│   ├── config.mjs          # org/repo 常量集中处
│   └── generate-catalog.mjs
├── .github/workflows/catalog.yml
└── skills/                 # = 插件市场根
    ├── lens/               # ① 方法
    ├── craft/              # ② 工具
    ├── guardrail/          # ③ 护栏
    ├── packages/           # 跨三层 Skill 包
    └── meta/               # skill-creator / skill-finder
```

---

*我们相信创造力不该被垄断。把它还给每一个想创造的人。*
