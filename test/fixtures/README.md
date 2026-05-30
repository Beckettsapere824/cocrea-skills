# test/fixtures —— 回归测试夹具（**非真实 skill，不会被分发**）

这里放的是**故意构造**的 SKILL.md，用来验证 `scripts/generate-catalog.mjs` 的三条质量红线告警能否精确触发。

## 为什么放在这里，而不是 `skills/` 下

`marketplace.json` 把 `./skills/lens|craft|guardrail|meta` 整个目录声明为可分发 skill。**Claude 插件加载器会加载这些目录下的一切**——它不认我们脚本里的 `_` 前缀约定。

所以：
- `skills/` 树 = **只放可分发的生产 skill**，进去的都会被订阅者加载。
- 草稿 / 测试夹具 = **必须住在 `skills/` 之外**（就是这里）。

`generate-catalog.mjs` 的 `isFixture()`（过滤 `_` 前缀）保留为**二级防御**，防止有人误把 `_draft` 丢进 `skills/`。但第一道防线是物理隔离：夹具不进 `skills/`。

## 两个夹具

- `lens/_example/` —— 合规样板：三层字段齐全、lens 带 transfer、body 含「立场」段。跑校验应**零告警**。
- `lens/_bad-example/` —— 故意写坏：缺 `cocrea_layer` / lens 缺 transfer / body 缺「立场」段。用来确认三条告警**都能被触发**。

## 怎么用（手动回归）

这是手动夹具，没有自动 test runner（刻意不引入重型测试基础设施）。验证告警逻辑时，临时把 `_bad-example` 复制进 `skills/lens/` 跑一次 `npm run catalog`，确认三条告警精确触发，再删掉。

> 给 Omni：如果未来要做自动化告警回归，可加一个 `npm run test:warnings` 脚本，对本目录跑校验并断言告警数。当前规模下手动验证足够，不急着上。
