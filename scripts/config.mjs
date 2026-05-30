// ─────────────────────────────────────────────────────────────────────────────
// CoCrea 全局常量 —— GitHub 组织/仓库名集中于此一处。
//
// 如需迁移仓库，只改这里 + .claude-plugin/marketplace.json + README，
// 不要把仓库名散落到脚本各处。
// ─────────────────────────────────────────────────────────────────────────────

/** GitHub org/repo（owner/repo 形式），用于插件市场订阅命令与 raw URL。 */
export const REPO_SLUG = "Beckettsapere824/cocrea-skills";

/** 插件市场 name（kebab-case，对应 .claude-plugin/marketplace.json 的 name 字段）。 */
export const MARKETPLACE_NAME = "cocrea-skills";

/** raw.githubusercontent 基址，skill-finder 未 clone 时拉 CATALOG.json 用。 */
export const RAW_BASE = `https://raw.githubusercontent.com/${REPO_SLUG}/main`;

/** 一行订阅命令（README / finder 提示用）。 */
export const INSTALL_CMD = `/plugin marketplace add ${REPO_SLUG}`;
