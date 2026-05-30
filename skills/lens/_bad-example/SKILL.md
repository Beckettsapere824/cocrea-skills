---
name: example-bad-no-stance
description: "（回归测试样例）一个故意写得不合规的 lens skill，用来验证 generate-catalog.mjs 的质量告警是否生效。"

cocrea_layer: lens
cocrea_title: 反面样例（缺立场 + 缺迁移）
cocrea_discipline: economics
cocrea_level: beginner
cocrea_tags: [测试, 反面样例]
cocrea_version: v1
cocrea_maintainer: "@omni"
# ⚠️ 故意缺 cocrea_transfer：触发「lens 必须可迁移」告警
---

# 反面样例（故意不合规）

> 此文件以 `_` 前缀命名，属回归测试样例，不计入正式内容。
> 它**故意**违反两条质量红线，用来验证脚本告警：
>   1. layer=lens 却缺 `cocrea_transfer`
>   2. body 缺 `## 立场` 段
> 脚本应对这两点各打一条 warning，但**不阻断**生成（W1 策略）。

## 目标
演示一个缺失立场与迁移场景的 skill 会被脚本如何标记。

## 使用流程
1. 这里没有 `## 立场` 段。
2. frontmatter 里也没有 `cocrea_transfer`。
3. 跑 `npm run catalog` 应看到两条针对本文件的告警。
