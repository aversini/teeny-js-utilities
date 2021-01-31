const {
  deepEqual,
  displayErrorMessages,
  printHTTPLogs,
  runCommand,
  shallowMerge,
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

describe("when testing for individual utilities wtih no logging side-effects", () => {
  it("should convert the first letter of a sentence to uppercase", async () => {
    expect(upperFirst("this is a test")).toBe("This is a test");
  });

  it("should return the command output via stdout", async () => {
    const { stdout, stderr } = await runCommand("echo 'hello'", {
      verbose: true,
    });
    expect(stdout).toBe("hello");
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

  it("should not throw an error even if the command fails", async () => {
    await expect(
      runCommand("not-a-command", { ignoreError: true })
    ).resolves.toBeUndefined();
  });

  it("should return a new configuration with custom nexPossible", async () => {
    const configA = {
      port: 8080,
      cache: 0,
      cors: false,
      gzip: true,
      logs: false,
      open: false,
      path: process.cwd(),
      headers: [
        {
          "X-Powered-By": "Teeny Static Server",
        },
      ],
    };
    const configB = {
      cache: 0,
      cors: false,
      gzip: true,
      logs: false,
      open: false,
      path: process.cwd(),
      port: 8080,
      headers: [
        {
          "X-Powered-By": "Teeny Static Server",
        },
      ],
    };
    const configC = {
      port: 8081,
      gzip: false,
    };
    expect(deepEqual(configA, configB)).toBe(true);
    expect(deepEqual(configA, configC)).toBe(false);
    /**
     * This method will alter the objects, so no way to test for their
     * equality AFTER the merge is done... Only thing we can do is test
     * that the end result gets the right values.
     */
    const res = shallowMerge(configA, configC);

    // eslint-disable-next-line no-magic-numbers
    expect(res.port).toBe(8081);
    expect(res.cache).toBe(0);
    expect(res.cors).toBe(false);
    expect(res.gzip).toBe(false);
    expect(res.logs).toBe(false);
    expect(res.open).toBe(false);
    expect(res.path).toBe(process.cwd());
    expect(
      deepEqual(res.headers, [{ "X-Powered-By": "Teeny Static Server" }])
    ).toBe(true);
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
