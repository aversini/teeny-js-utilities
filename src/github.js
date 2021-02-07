/* eslint-disable no-magic-numbers, complexity */

function normalizeGithubURL(url, opts) {
  opts = opts || {};
  // whitelist of URLs that should be treated as GitHub repos.
  const baseUrls = ["gist.github.com", "github.com"].concat(
    opts.extraBaseUrls || []
  );
  // build regex from whitelist.
  const re = new RegExp(
    `${
      /^(?:https?:\/\/|git:\/\/|git\+ssh:\/\/)?(?:[^@]+@)?/.source
    }(${baseUrls.join("|")})${/[:/]([^/]+\/[^/]+?|[0-9]+)$/.source}`
  );

  try {
    const m = re.exec(url.replace(/\.git$/, ""));
    const host = m[1];
    const path = m[2];
    return `https://${host}/${path}`;
  } catch (err) {
    return url;
  }
}

/*
 * Based on:
 * parse-github-url <https://github.com/jonschlinkert/parse-github-url>
 *
 * - refactor to replace url.parse (deprecated) with new URL()
 * - simplified because it's using normalizeGithubURL() before parsing
 * - simplified to return only relevant GitHub keys
 *
 */

/**
 *
 * @param {string} url the GitHub URL to parse
 * @param {object} opts options
 * @param {array <string>} opts.extraBaseUrls array of valid base URLs
 *                                            (e.g. enterprise.github.com)
 * @returns {object}
 * @property {string} host the hostname
 * @property {string} href the normalized url
 * @property {string} name the package name
 * @property {string} owner the owner of the package (GitHub username)
 * @property {string} repo the repository name
 *
 */
function parseGitHubURL(url, opts) {
  const str = normalizeGithubURL(url, opts);

  if (typeof str !== "string" || !str.length) {
    return null;
  }

  /**
   * Gist are not parsable (no owner, no repo)
   */
  if (str.indexOf("git@gist") !== -1 || str.indexOf("//gist") !== -1) {
    return null;
  }

  // parse the URL
  let obj;
  try {
    obj = new URL(str);
  } catch (e) {
    return null;
  }

  if (obj.pathname.indexOf("/repos") === 0) {
    obj.pathname = obj.pathname.slice(7);
  }

  const seg = obj.pathname.split("/").filter(Boolean);

  obj.owner = seg[0];
  obj.name = seg[1].replace(/^\W+|\.git$/g, "");
  obj.repo = `${obj.owner}/${obj.name}`;

  return {
    host: obj.host,
    href: obj.href,
    name: obj.name,
    owner: obj.owner,
    repo: obj.repo,
  };
}

module.exports = {
  parseGitHubURL,
};
