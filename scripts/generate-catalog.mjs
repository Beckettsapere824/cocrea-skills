#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// generate-catalog.mjs —— CoCrea 库目录生成器（阶段2 唯一硬代码）
//
// 职责：递归扫描 skills/**/SKILL.md 与 skills/packages/* /PACKAGE.md 的 YAML
//      frontmatter，生成仓库根 CATALOG.json，作为 skill-finder 的机器可读数据源。
//
// 设计原则：
//   - 自动生成，不手写（手写必腐烂）。
//   - 用 gray-matter 解析 frontmatter，不手写 YAML 解析。
//   - cocrea_ 前缀字段去前缀映射进 catalog；Anthropic 标准字段(name/description)直取。
//   - 质量红线只「告警」不「阻断」（W1 决策，见任务书）。
//
// 用法：
//   node scripts/generate-catalog.mjs           # 生成 CATALOG.json
//   node scripts/generate-catalog.mjs --check    # 只校验是否最新，有 diff 退出码 1（CI 用）
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const SKILLS_DIR = join(REPO_ROOT, "skills");
const CATALOG_PATH = join(REPO_ROOT, "CATALOG.json");

const VALID_LAYERS = ["lens", "craft", "guardrail", "meta"];

const warnings = [];
function warn(file, msg) {
  warnings.push(`⚠️  [${relative(REPO_ROOT, file)}] ${msg}`);
}

/** 路径含 `_` 开头的目录段 → 视为测试 fixture / 草稿，不计入正式 catalog。 */
function isFixture(absFile) {
  return relative(SKILLS_DIR, absFile)
    .split(/[\\/]/)
    .some((seg) => seg.startsWith("_"));
}

/** body 是否含 `## 立场` 段（兼容半角/全角空格、可带英文别名）。 */
function hasStanceSection(body) {
  return /^#{1,6}\s*立场(\s*\(?\s*Stance\s*\)?)?\s*$/im.test(body);
}

/** 从 body 第一行 `# 标题` 回退取 title。 */
function fallbackTitle(body) {
  const m = body.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

/** 解析单个原子 SKILL.md → catalog 条目（含红线告警）。 */
function parseSkill(file) {
  const raw = readFileSync(file, "utf8");
  const { data: fm, content: body } = matter(raw);

  const layer = fm.cocrea_layer;
  const name = fm.name ?? null;

  // ── 质量红线告警（不阻断）──
  if (!layer) {
    warn(file, "缺 cocrea_layer（标准红线：每个 skill 必须归属且仅归属一层）");
  } else if (!VALID_LAYERS.includes(layer)) {
    warn(file, `cocrea_layer 值非法: "${layer}"（应为 ${VALID_LAYERS.join(" | ")}）`);
  }
  if (layer === "lens" && (!fm.cocrea_transfer || fm.cocrea_transfer.length === 0)) {
    warn(file, "layer=lens 但缺 cocrea_transfer（标准红线：lens 必须可迁移）");
  }
  if (!hasStanceSection(body)) {
    warn(file, "body 缺 `## 立场` 段（标准红线：无立场不录入）");
  }
  if (!name) {
    warn(file, "缺 name（Anthropic 标准字段，触发机制依赖它）");
  }

  return {
    name,
    title: fm.cocrea_title ?? fallbackTitle(body) ?? name,
    layer: layer ?? null,
    discipline: fm.cocrea_discipline ?? null,
    level: fm.cocrea_level ?? null,
    transfer: fm.cocrea_transfer ?? [],
    description: fm.description ?? "",
    tags: fm.cocrea_tags ?? [],
    path: relative(REPO_ROOT, dirname(file)),
  };
}

/** 解析单个 PACKAGE.md → packages 条目。 */
function parsePackage(file) {
  const raw = readFileSync(file, "utf8");
  const { data: fm, content: body } = matter(raw);
  return {
    package: fm.package ?? null,
    title: fm.title ?? fallbackTitle(body) ?? fm.package ?? null,
    layers: fm.layers ?? [],
    skills: fm.skills ?? [],
    path: relative(REPO_ROOT, dirname(file)),
  };
}

async function build() {
  if (!existsSync(SKILLS_DIR)) {
    console.error(`✗ 找不到 skills 目录: ${SKILLS_DIR}`);
    process.exit(1);
  }

  // 扫描原子 skill（排除 packages/ 下的，那些走 PACKAGE.md）
  const skillFiles = (
    await glob("**/SKILL.md", { cwd: SKILLS_DIR, absolute: true })
  )
    .filter((f) => !isFixture(f))
    .sort();
  const pkgFiles = (
    await glob("packages/*/PACKAGE.md", { cwd: SKILLS_DIR, absolute: true })
  )
    .filter((f) => !isFixture(f))
    .sort();

  const skills = skillFiles.map(parseSkill);
  const packages = pkgFiles.map(parsePackage);

  const catalog = {
    generated_at: new Date().toISOString(),
    skill_count: skills.length,
    package_count: packages.length,
    skills,
    packages,
  };

  return catalog;
}

function serialize(catalog) {
  return JSON.stringify(catalog, null, 2) + "\n";
}

/** --check 时忽略 generated_at（时间戳每次必变，不算实质 diff）。 */
function stableView(jsonText) {
  try {
    const o = JSON.parse(jsonText);
    delete o.generated_at;
    return JSON.stringify(o, null, 2);
  } catch {
    return null;
  }
}

const isCheck = process.argv.includes("--check");
const catalog = await build();
const next = serialize(catalog);

if (isCheck) {
  const prev = existsSync(CATALOG_PATH) ? readFileSync(CATALOG_PATH, "utf8") : "";
  if (stableView(prev) !== stableView(next)) {
    console.error("✗ CATALOG.json 与实际内容漂移。请本地运行 `npm run catalog` 后提交。");
    if (warnings.length) console.error("\n" + warnings.join("\n"));
    process.exit(1);
  }
  console.log("✓ CATALOG.json 与内容一致。");
} else {
  writeFileSync(CATALOG_PATH, next);
  console.log(
    `✓ CATALOG.json 已生成：${catalog.skill_count} skills / ${catalog.package_count} packages。`
  );
}

if (warnings.length) {
  console.warn(`\n${warnings.length} 条质量告警（不阻断，供质量红线自动化参考）：`);
  console.warn(warnings.join("\n"));
} else {
  console.log("✓ 无质量告警。");
}
