/* eslint-disable no-magic-numbers */
const _ = require("lodash");

const {
  capitalize,
  deepEqual,
  displayErrorMessages,
  isScopedPackage,
  kebabCase,
  parseGitHubURL,
  printHTTPLogs,
  runCommand,
  shallowMerge,
  uniqueID,
  upperFirst,
} = require("../index");

let mockLog,
  mockLogError,
  mockLogWarning,
  spyExit,
  spyLog,
  spyLogError,
  spyLogWarning,
  mockExit;

describe("when testing for individual utilities with no logging side-effects", () => {
  it("should convert the first letter of a sentence to uppercase", async () => {
    expect(upperFirst("this is a test")).toBe("This is a test");
  });

  it("should Converts the first character of string to upper case and the remaining to lower case.", async () => {
    expect(capitalize("this Is A Test")).toBe("This is a test");
  });

  it("should return a valid kebab case string", async () => {
    expect(kebabCase("fooBar")).toStrictEqual("foo-bar");
    expect(kebabCase("fooBarBaz")).toStrictEqual("foo-bar-baz");
    expect(kebabCase("foo bar")).toStrictEqual("foo-bar");
    expect(kebabCase("foo barBaz")).toStrictEqual("foo-bar-baz");
    expect(kebabCase("foo barBaz quux")).toStrictEqual("foo-bar-baz-quux");
    expect(kebabCase("ceci est très sérieux")).toStrictEqual(
      "ceci-est-tres-serieux"
    );
    expect(kebabCase("Foo----Bar")).toStrictEqual("foo-bar");
    expect(kebabCase(42)).toStrictEqual("42");
  });

  it("should tell if a package is scoped or not", async () => {
    expect(isScopedPackage("not-scoped")).toBe(false);
    expect(isScopedPackage("@versini/scoped")).toBe(true);
    expect(isScopedPackage("not a valid name @versini/scoped")).toBe(false);
  });
});

describe("when testing for uniqueID with no logging side-effects", () => {
  it("should return two unique random numbers in both dev and prod mode", () => {
    const nodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    expect(uniqueID()).not.toEqual(uniqueID());
    process.env.NODE_ENV = "development";
    expect(uniqueID()).not.toEqual(uniqueID());

    // Restore original node env.
    process.env.NODE_ENV = nodeEnv;
  });
  it("should return two prefixed, unique random numbers in dev mode", () => {
    const nodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV !== "production";
    const randomString1 = uniqueID("some-prefix-");
    const randomString2 = uniqueID("some-prefix-");
    expect(randomString1).toMatch(/some-prefix-[0-9]{1,}/);
    expect(randomString1).not.toEqual(randomString2);

    // Restore original node env.
    process.env.NODE_ENV = nodeEnv;
  });
  it("should return two prefixed, unique random numbers in prod mode", () => {
    const nodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const randomString1 = uniqueID("some-prefix-");
    const randomString2 = uniqueID("some-prefix-");
    expect(randomString1).toMatch(/some-prefix-[0-9]{10,}/);
    expect(randomString1).not.toEqual(randomString2);

    // Restore original node env.
    process.env.NODE_ENV = nodeEnv;
  });
});

describe("when testing for runCommand utilities with no logging side-effects", () => {
  it("should return the command output via stdout", async () => {
    const { stdout, stderr } = await runCommand("echo hello", {
      verbose: true,
    });
    expect(stdout).toBe("hello");
    expect(stderr).toBe("");
  });

  it("should run 2 commands one after the other", async () => {
    const { stdout, stderr } = await runCommand("echo hello && echo world", {
      verbose: true,
    });
    expect(stdout).toBe("hello\nworld");
    expect(stderr).toBe("");
  });

  it("should not return the command output via stdout", async () => {
    const { stdout, stderr } = await runCommand("echo 'hello'");
    expect(stdout).not.toBeDefined();
    expect(stderr).not.toBeDefined();
  });

  it("should throw an error if the command fails", async () => {
    await expect(runCommand("not-a-command")).rejects.toBeTruthy();
  });

  it("should not throw an error even if the command does not exist", async () => {
    expect.assertions(1);
    const res = await runCommand("not-a-command", {
      ignoreError: true,
    });
    expect(res).toStrictEqual({
      exitCode: 1,
      shortMessage:
        "Command failed with ENOENT: not-a-command\nspawn not-a-command ENOENT",
    });
  });

  it("should not throw an error even if the command fails", async () => {
    expect.assertions(2);
    const res = await runCommand("ls /no-existing-folder", {
      ignoreError: true,
    });
    expect(res.exitCode).toBeGreaterThan(0);
    expect(res.shortMessage).toBe(
      `Command failed with exit code ${res.exitCode}: ls /no-existing-folder`
    );
  });
});

describe("when testing for merging utilities with no logging side-effects", () => {
  it("should return a new configuration with keys for objB replacing keys from objA with shallowMerge", async () => {
    const configDefault = {
      cache: 0,
      cors: false,
      gzip: true,
      headers: [
        {
          key1: "value1",
        },
        {
          key2: "value2",
        },
      ],
      logs: false,
      open: false,
      path: process.cwd(),
      port: 8080,
    };
    const configCustom = {
      gzip: false,
      headers: [
        {
          key1: "newValue1",
        },
      ],
      port: 8081,
    };
    expect(deepEqual(configDefault, configDefault)).toBe(true);
    expect(deepEqual(configDefault, configCustom)).toBe(false);
    /**
     * This method will alter the objects, so no way to test for their
     * equality AFTER the merge is done... Only thing we can do is test
     * that the end result gets the right values.
     */
    const res = shallowMerge(configDefault, configCustom);

    // eslint-disable-next-line no-magic-numbers
    expect(res.port).toBe(8081);
    expect(res.cache).toBe(0);
    expect(res.cors).toBe(false);
    expect(res.gzip).toBe(false);
    expect(res.logs).toBe(false);
    expect(res.open).toBe(false);
    expect(res.path).toBe(process.cwd());

    expect(
      deepEqual(res.headers, [{ key1: "newValue1" }, { key2: "value2" }])
    ).toBe(true);
  });

  it("should behave exactly as lodash.merge", async () => {
    const object = {
      a: [{ b: 2 }, { d: 4 }],
    };
    const other = {
      a: [{ c: 3 }, { e: 5 }],
    };
    const res = shallowMerge(object, other);
    expect(
      deepEqual(res, {
        a: [
          { b: 2, c: 3 },
          { d: 4, e: 5 },
        ],
      })
    ).toBe(true);
  });

  it("should return a new configuration with custom nexPossible", async () => {
    const configA = {
      bump: {
        nextPossible: [
          {
            default: false,
            type: "minor",
          },
        ],
      },
    };
    const configB = {
      bump: {
        nextPossible: [
          {
            default: true,
            type: "minor",
          },
        ],
      },
    };
    expect(deepEqual(configA, configB)).toBe(false);
    /**
     * This method will alter the objects, so no way to test for their
     * equality AFTER the merge is done... Only thing we can do is test
     * that the end result gets the right values.
     */
    const res = shallowMerge(configA, configB, (def, cust, key) => {
      if (key === "nextPossible") {
        return _.orderBy(
          _.values(_.merge(_.keyBy(def, "type"), _.keyBy(cust, "type"))),
          ["pos"]
        );
      }
    });

    expect(
      deepEqual(res.bump.nextPossible, [
        {
          default: true,
          type: "minor",
        },
      ])
    ).toBe(true);
  });

  it("should behave exactly as lodash.mergeWith", async () => {
    const object = { a: [1], b: [2] };
    const other = { a: [3], b: [4] };
    const res = shallowMerge(object, other, (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });
    expect(deepEqual(res, { a: [1, 3], b: [2, 4] })).toBe(true);
  });
});

describe("when testing for github utilities with no logging side-effects", () => {
  it("should extract lots of data from a range of GitHub URLs", async () => {
    let res = parseGitHubURL("https://github.com/aversini/teeny-js-utilities");

    expect(res.host).toBe("github.com");
    expect(res.href).toBe("https://github.com/aversini/teeny-js-utilities");
    expect(res.name).toBe("teeny-js-utilities");
    expect(res.owner).toBe("aversini");
    expect(res.repo).toBe("aversini/teeny-js-utilities");

    res = parseGitHubURL("git@github.com:aversini/teeny-js-utilities.git");

    expect(res.host).toBe("github.com");
    expect(res.href).toBe("https://github.com/aversini/teeny-js-utilities");
    expect(res.name).toBe("teeny-js-utilities");
    expect(res.owner).toBe("aversini");
    expect(res.repo).toBe("aversini/teeny-js-utilities");
  });

  it("should extract the right owner from a range of GitHub URLs", async () => {
    expect(parseGitHubURL("")).toBe(null);
    expect(parseGitHubURL("https://github.com/aversini/packages").owner).toBe(
      "aversini"
    );

    expect(parseGitHubURL("git@github.com:assemble/verb.git").owner).toBe(
      "assemble"
    );

    expect(parseGitHubURL("git+ssh://github.com/assemble/verb.git").owner).toBe(
      "assemble"
    );

    expect(parseGitHubURL("git@gist.github.com:9284722.git")).toBe(null);
    expect(parseGitHubURL("git@github.com:assemble/verb.git#0.6.0").owner).toBe(
      "assemble"
    );

    expect(
      parseGitHubURL("git@github.com:assemble/verb.git#v0.6.0").owner
    ).toBe("assemble");

    expect(parseGitHubURL("git@github.com:assemble/verb.git").owner).toBe(
      "assemble"
    );
    expect(parseGitHubURL("http://github.com/assemble/verb").owner).toBe(
      "assemble"
    );
    expect(parseGitHubURL("http://github.com/assemble/verb.git").owner).toBe(
      "assemble"
    );

    expect(parseGitHubURL("http://github.com/assemble/verb/tree").owner).toBe(
      "assemble"
    );

    expect(
      parseGitHubURL("http://github.com/assemble/verb/tree/master").owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("http://github.com/assemble/verb/tree/master/foo/bar")
        .owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://assemble@github.com/assemble/verb.git").owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://foo.github.com/assemble/verb/bar.tar.gz").owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://foo.github.com/assemble/verb/bar.zip").owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://parseGitHubURL.pages.com/assemble/verb.git").owner
    ).toBe("assemble");

    expect(parseGitHubURL("https://gist.github.com/9284722.git")).toBe(null);
    expect(parseGitHubURL("https://github.com/assemble/verb").owner).toBe(
      "assemble"
    );
    expect(parseGitHubURL("https://github.com/assemble/verb.git").owner).toBe(
      "assemble"
    );

    expect(
      parseGitHubURL(
        "https://github.com/assemble/verb/blob/249b21a86400b38969cee3d5df6d2edf8813c137/README.md"
      ).owner
    ).toBe("assemble");

    expect(
      parseGitHubURL(
        "https://github.com/assemble/verb/blob/master/assemble/index.js"
      ).owner
    ).toBe("assemble");

    expect(
      parseGitHubURL(
        "https://github.com/assemble/verb/blob/master/foo/index.js"
      ).owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://github.com/assemble/verb/blob/v1.0.0/README.md")
        .owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://github.com/assemble/verb/tree/0.2.0").owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://github.com/assemble/verb/tree/dev").owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://github.com/assemble/verb/tree/feature/dev").owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://github.com/repos/assemble/verb/tarball").owner
    ).toBe("assemble");

    expect(
      parseGitHubURL("https://github.com/repos/assemble/verb/zipball").owner
    ).toBe("assemble");

    expect(parseGitHubURL()).toBe(null);
    expect(parseGitHubURL("toto")).toBe(null);
    expect(parseGitHubURL(null)).toBe(null);
  });
});

/**
 * Some utilities have logging capabilities that needs to be
 * tested a little bit differently:
 * - mocking process.exit
 * - console.log
 * - inquirer.prompt
 */
describe("when testing for utilities with logging side-effects", () => {
  beforeEach(() => {
    mockExit = jest.fn();
    mockLog = jest.fn();
    mockLogError = jest.fn();
    mockLogWarning = jest.fn();

    spyExit = jest.spyOn(process, "exit").mockImplementation(mockExit);
    spyLog = jest.spyOn(console, "log").mockImplementation(mockLog);
    spyLogError = jest.spyOn(console, "error").mockImplementation(mockLogError);
    spyLogWarning = jest
      .spyOn(console, "warn")
      .mockImplementation(mockLogWarning);
  });
  afterEach(() => {
    spyExit.mockRestore();
    spyLog.mockRestore();
    spyLogError.mockRestore();
    spyLogWarning.mockRestore();
  });

  it("should display the proper error messages and exit with 0", async () => {
    displayErrorMessages(["message one", "message two"]);
    expect(mockLogError).toHaveBeenCalledWith("message one");
    expect(mockLogError).toHaveBeenCalledWith("message two");
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should display the proper error messages but NOT exit with 0", async () => {
    displayErrorMessages(["message one", "message two"], false);
    expect(mockLogError).toHaveBeenCalledWith("message one");
    expect(mockLogError).toHaveBeenCalledWith("message two");
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("should not display any error messages and should not exit with 0", async () => {
    displayErrorMessages();
    expect(mockLogError).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("should display HTTP logs with date and time", async () => {
    const spyDate = jest
      .spyOn(Date.prototype, "toDateString")
      .mockImplementation(() => "Sat Oct 31 2020");
    const spyLocaleTime = jest
      .spyOn(Date.prototype, "toLocaleTimeString")
      .mockImplementation(() => "5:00:00 PM");

    printHTTPLogs({ method: "GET", url: "/" });
    expect(mockLog).toHaveBeenCalledWith(
      "[ Sat Oct 31 2020 5:00:00 PM ] GET /"
    );
    spyDate.mockRestore();
    spyLocaleTime.mockRestore();
  });
});
