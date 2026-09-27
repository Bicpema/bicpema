import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import {
  applyRedirect,
  checkPublishedUrls,
  existsInPublicDir,
  redirectSourceToRegExp,
  resolvePathname,
  toSitePathname
} from "../../scripts/_lib/checkPublishedUrls.js";

const SITE_ORIGIN = "https://bicpema.com";

// public/ はgit管理対象外のため、ビルド成果物を模したディレクトリを一時的に作成する
/** @type {string} */
let publicDir;

beforeAll(() => {
  publicDir = mkdtempSync(join(tmpdir(), "published-urls-"));
  for (const file of [
    "index.html",
    "post/自由落下/index.html",
    "vite/simulations/sim-a/index.html",
    "vite/simulations/sim-b/index.html",
    "logo.svg"
  ]) {
    const filePath = join(publicDir, file);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, "");
  }
});

afterAll(() => {
  rmSync(publicDir, { recursive: true, force: true });
});

const redirects = [
  {
    source: "/vite/simulations/old-sim-a/:slug*",
    destination: "/vite/simulations/sim-a/:slug*",
    type: 301
  },
  {
    source: "/simulations/:slug*",
    destination: "/vite/simulations/:slug*",
    type: 301
  }
];

describe("toSitePathname", () => {
  it("サイトの絶対URLからクエリ・フラグメントを除いたパス名を返す", () => {
    expect(
      toSitePathname(
        "https://bicpema.com/vite/simulations/sim-a/?x=1#top",
        SITE_ORIGIN
      )
    ).toEqual({ pathname: "/vite/simulations/sim-a/" });
  });

  it("パーセントエンコードされた日本語パスをデコードする", () => {
    expect(
      toSitePathname(
        "https://bicpema.com/post/%E8%87%AA%E7%94%B1%E8%90%BD%E4%B8%8B/",
        SITE_ORIGIN
      )
    ).toEqual({ pathname: "/post/自由落下/" });
  });

  it("サイト以外のホストのURLはエラーを返す", () => {
    expect(toSitePathname("https://example.com/", SITE_ORIGIN)).toHaveProperty(
      "error"
    );
  });
});

describe("existsInPublicDir", () => {
  it("末尾スラッシュのパスはindex.htmlの存在で判定する", () => {
    expect(existsInPublicDir(publicDir, "/")).toBe(true);
    expect(existsInPublicDir(publicDir, "/vite/simulations/sim-a/")).toBe(true);
    expect(existsInPublicDir(publicDir, "/vite/simulations/sim-x/")).toBe(
      false
    );
  });

  it("末尾スラッシュのないパスはファイルまたはディレクトリのindex.htmlの存在で判定する", () => {
    expect(existsInPublicDir(publicDir, "/logo.svg")).toBe(true);
    expect(existsInPublicDir(publicDir, "/vite/simulations/sim-a")).toBe(true);
  });

  it("publicDirの外を指すパスは存在しないものとして扱う", () => {
    expect(existsInPublicDir(publicDir, "/../outside/")).toBe(false);
  });
});

describe("redirectSourceToRegExp", () => {
  it(":name* は0個以上のセグメントに一致する", () => {
    const pattern = redirectSourceToRegExp("/simulations/:slug*");

    expect(pattern.exec("/simulations/sim-a/")?.groups?.slug).toBe("sim-a/");
    expect(pattern.test("/simulations")).toBe(true);
    expect(pattern.test("/other/sim-a/")).toBe(false);
  });

  it(":name は1セグメント、* はセグメント内の任意文字列に一致する", () => {
    expect(redirectSourceToRegExp("/post/:slug").test("/post/a/")).toBe(true);
    expect(redirectSourceToRegExp("/post/:slug").test("/post/a/b/")).toBe(
      false
    );
    expect(redirectSourceToRegExp("/img/*.png").test("/img/a.png")).toBe(true);
  });
});

describe("applyRedirect", () => {
  it("最初に一致したリダイレクトのdestinationにキャプチャを埋め込んで返す", () => {
    expect(applyRedirect("/vite/simulations/old-sim-a/", redirects)).toBe(
      "/vite/simulations/sim-a/"
    );
    expect(applyRedirect("/simulations/sim-b/", redirects)).toBe(
      "/vite/simulations/sim-b/"
    );
  });

  it("RE2構文のregexで指定されたリダイレクトにも対応する", () => {
    expect(
      applyRedirect("/old/sim-a/", [
        {
          regex: "^/old/(?P<slug>[^/]+)/$",
          destination: "/vite/simulations/:slug/"
        }
      ])
    ).toBe("/vite/simulations/sim-a/");
  });

  it("一致するリダイレクトがなければnullを返す", () => {
    expect(applyRedirect("/unknown/", redirects)).toBeNull();
  });
});

describe("resolvePathname", () => {
  it("リダイレクトを辿ってリダイレクト先が存在すればアクセス可能とする", () => {
    expect(
      resolvePathname({ pathname: "/simulations/sim-a/", publicDir, redirects })
    ).toEqual({
      accessible: true,
      redirectChain: ["/vite/simulations/sim-a/"]
    });
  });

  it("リダイレクトのループはアクセス不可とする", () => {
    const loop = [
      { source: "/a/", destination: "/b/" },
      { source: "/b/", destination: "/a/" }
    ];

    expect(
      resolvePathname({ pathname: "/a/", publicDir, redirects: loop })
        .accessible
    ).toBe(false);
  });

  it("外部サイトへのリダイレクトはアクセス可能とみなす", () => {
    expect(
      resolvePathname({
        pathname: "/external/",
        publicDir,
        redirects: [
          { source: "/external/", destination: "https://example.com/" }
        ]
      }).accessible
    ).toBe(true);
  });
});

describe("checkPublishedUrls", () => {
  it("存在するURLと有効なリダイレクトのあるURLは問題なしとする", () => {
    const result = checkPublishedUrls({
      entries: [
        { url: "https://bicpema.com/" },
        { url: "https://bicpema.com/post/自由落下/" },
        { url: "https://bicpema.com/vite/simulations/old-sim-a/" }
      ],
      publicDir,
      siteOrigin: SITE_ORIGIN,
      redirects
    });

    expect(result).toEqual({ invalidEntries: [], unreachableUrls: [] });
  });

  it("ページもリダイレクト先も存在しないURLをunreachableUrlsとして検出する", () => {
    const result = checkPublishedUrls({
      entries: [
        { url: "https://bicpema.com/vite/simulations/sim-x/" },
        { url: "https://bicpema.com/simulations/sim-x/" }
      ],
      publicDir,
      siteOrigin: SITE_ORIGIN,
      redirects
    });

    expect(result.unreachableUrls).toEqual([
      {
        url: "https://bicpema.com/vite/simulations/sim-x/",
        pathname: "/vite/simulations/sim-x/",
        redirectChain: []
      },
      {
        url: "https://bicpema.com/simulations/sim-x/",
        pathname: "/simulations/sim-x/",
        redirectChain: ["/vite/simulations/sim-x/"]
      }
    ]);
  });

  it("url未指定・重複・他サイトのエントリをinvalidEntriesとして検出する", () => {
    const result = checkPublishedUrls({
      entries: [
        { url: undefined },
        { url: "https://bicpema.com/" },
        { url: "https://bicpema.com/" },
        { url: "https://example.com/" }
      ],
      publicDir,
      siteOrigin: SITE_ORIGIN,
      redirects
    });

    expect(result.invalidEntries.map(({ url }) => url)).toEqual([
      undefined,
      "https://bicpema.com/",
      "https://example.com/"
    ]);
    expect(result.unreachableUrls).toEqual([]);
  });
});
