import { existsSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";

// リダイレクトを辿る最大回数（リダイレクトのループ対策）
const MAX_REDIRECT_HOPS = 10;

/**
 * 掲載URLをサイト内のパス名に変換する。
 * 絶対URLはサイトのホストと一致する場合のみ受け付け、クエリ・フラグメントは除去する。
 * 教科書などにパーセントエンコードされた日本語パスが掲載されうるため、デコードして返す。
 * @param {string} url
 * @param {string} siteOrigin 例: "https://bicpema.com"
 * @returns {{ pathname: string } | { error: string }}
 */
export function toSitePathname(url, siteOrigin) {
  let parsed;
  try {
    parsed = new URL(url, siteOrigin);
  } catch {
    return { error: "URLの形式が不正です" };
  }
  if (parsed.host !== new URL(siteOrigin).host) {
    return { error: `${siteOrigin} 以外のURLは検査できません` };
  }
  try {
    return { pathname: decodeURIComponent(parsed.pathname) };
  } catch {
    return { error: "パスのパーセントエンコードが不正です" };
  }
}

/**
 * Firebase Hostingの静的配信と同様に、パス名に対応するファイルがビルド成果物に存在するか判定する。
 * "/foo/" は "/foo/index.html"、"/foo" は "/foo" または "/foo/index.html" を探す。
 * @param {string} publicDir
 * @param {string} pathname
 * @returns {boolean}
 */
export function existsInPublicDir(publicDir, pathname) {
  const root = resolve(publicDir);
  const target = resolve(join(root, pathname));
  // "../" などでpublicDirの外を指すパスは存在しないものとして扱う
  if (target !== root && !target.startsWith(root + sep)) {
    return false;
  }
  const candidates = pathname.endsWith("/")
    ? [join(target, "index.html")]
    : [target, join(target, "index.html")];
  return candidates.some(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile()
  );
}

/**
 * @param {string} text
 * @returns {string}
 */
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * firebase.jsonのredirectsのsource（":name" / ":name*" / "*" / "**" のglob）を正規表現に変換する。
 * @param {string} source
 * @returns {RegExp}
 */
export function redirectSourceToRegExp(source) {
  const segments = source.split("/").filter((segment) => segment !== "");
  let pattern = "";
  for (const segment of segments) {
    const named = segment.match(/^:([A-Za-z0-9_]+)(\*?)$/);
    if (named) {
      // ":name*" は0個以上のセグメント、":name" は1セグメントに一致する
      pattern += named[2]
        ? `(?:/(?<${named[1]}>.*))?`
        : `/(?<${named[1]}>[^/]+)`;
    } else if (segment === "**") {
      pattern += "(?:/.*)?";
    } else {
      pattern += "/" + segment.split("*").map(escapeRegExp).join("[^/]*");
    }
  }
  return new RegExp(`^${pattern}/?$`);
}

/**
 * firebase.jsonのリダイレクト定義（source または regex）を正規表現に変換する。
 * @param {{ source?: string, regex?: string }} redirect
 * @returns {RegExp | null}
 */
function toRedirectRegExp(redirect) {
  if (redirect.regex) {
    // Firebaseのregexは名前付きキャプチャにRE2の "(?P<name>...)" 構文を使うため、JavaScriptの構文に変換する
    return new RegExp(redirect.regex.replaceAll("(?P<", "(?<"));
  }
  if (redirect.source) {
    return redirectSourceToRegExp(redirect.source);
  }
  return null;
}

/**
 * パス名に一致する最初のリダイレクトを適用し、リダイレクト先を返す。
 * @param {string} pathname
 * @param {{ source?: string, regex?: string, destination: string }[]} redirects
 * @returns {string | null} 一致するリダイレクトがなければnull
 */
export function applyRedirect(pathname, redirects) {
  for (const redirect of redirects) {
    const match = toRedirectRegExp(redirect)?.exec(pathname);
    if (match) {
      const groups = match.groups ?? {};
      const destination = redirect.destination.replace(
        /:([A-Za-z0-9_]+)\*?/g,
        (_, name) => groups[name] ?? ""
      );
      // 空のキャプチャで生じる "//" を詰める（"https://" のスキームは対象外）
      return destination.replace(/(?<!:)\/{2,}/g, "/");
    }
  }
  return null;
}

/**
 * パス名がアクセス可能か（ビルド成果物に存在するか、リダイレクト先が存在するか）を判定する。
 * Firebase Hostingと同じく、静的ファイルをリダイレクトより優先する。
 * @param {object} options
 * @param {string} options.pathname
 * @param {string} options.publicDir
 * @param {{ source?: string, regex?: string, destination: string }[]} options.redirects
 * @returns {{ accessible: boolean, redirectChain: string[] }}
 */
export function resolvePathname({ pathname, publicDir, redirects }) {
  /** @type {string[]} */
  const redirectChain = [];
  let current = pathname;
  for (let hop = 0; hop <= MAX_REDIRECT_HOPS; hop++) {
    if (existsInPublicDir(publicDir, current)) {
      return { accessible: true, redirectChain };
    }
    const destination = applyRedirect(current, redirects);
    if (destination === null || redirectChain.includes(destination)) {
      return { accessible: false, redirectChain };
    }
    redirectChain.push(destination);
    // 外部サイトへのリダイレクトは到達先を検査できないため、アクセス可能とみなす
    if (/^https?:\/\//.test(destination)) {
      return { accessible: true, redirectChain };
    }
    current = destination;
  }
  return { accessible: false, redirectChain };
}

/**
 * 掲載URL一覧のエントリを検証し、サイト内のパス名を返す。
 * @param {{ url?: unknown }} entry
 * @param {Set<string>} seenUrls 登録済みURL（重複検出用。検証したURLを追加する）
 * @param {string} siteOrigin
 * @returns {{ url: string, pathname: string } | { url: unknown, reason: string }}
 */
function toEntryPathname(entry, seenUrls, siteOrigin) {
  const url = entry?.url;
  if (typeof url !== "string" || url === "") {
    return { url, reason: "urlが指定されていません" };
  }
  if (seenUrls.has(url)) {
    return { url, reason: "URLが重複して登録されています" };
  }
  seenUrls.add(url);

  const result = toSitePathname(url, siteOrigin);
  if ("error" in result) {
    return { url, reason: result.error };
  }
  return { url, pathname: result.pathname };
}

/**
 * 掲載URL一覧の各URLがビルド成果物からアクセス可能かを検査する。
 * @param {object} options
 * @param {{ url?: unknown }[]} options.entries 掲載URL一覧（data/published-urls.yaml）
 * @param {string} options.publicDir Vite・Astroのビルド成果物（dist/）
 * @param {string} options.siteOrigin 例: "https://bicpema.com"
 * @param {{ source?: string, regex?: string, destination: string }[]} [options.redirects] firebase.jsonのhosting.redirects
 * @returns {{
 *   invalidEntries: { url: unknown, reason: string }[],
 *   unreachableUrls: { url: string, pathname: string, redirectChain: string[] }[]
 * }}
 */
export function checkPublishedUrls({
  entries,
  publicDir,
  siteOrigin,
  redirects = []
}) {
  const invalidEntries = [];
  const unreachableUrls = [];
  /** @type {Set<string>} */
  const seenUrls = new Set();

  for (const entry of entries) {
    const result = toEntryPathname(entry, seenUrls, siteOrigin);
    if ("reason" in result) {
      invalidEntries.push(result);
    } else {
      const { accessible, redirectChain } = resolvePathname({
        pathname: result.pathname,
        publicDir,
        redirects
      });
      if (!accessible) {
        unreachableUrls.push({ ...result, redirectChain });
      }
    }
  }

  return { invalidEntries, unreachableUrls };
}
