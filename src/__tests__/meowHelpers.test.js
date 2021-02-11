const { meowOptionsHelper } = require("../index");

describe("when testing for meowHelpers with no logging side-effects", () => {
  it("should return the right helpText and valid options for meow", async () => {
    const { helpText, options } = meowOptionsHelper({
      examples: [
        {
          command: 'my-cli --type f --pattern=".sh$" --command "chmod +x"',
          comment:
            '## Find files with the extension ".jsx" in the "src" folder',
        },
        {
          command: 'my-cli --type f --pattern=".sh$" --command "chmod +x"',
          comment:
            '## Change the permissions to executable for all the files with extension ".sh" found under the "bin" folder',
        },
        {
          command: 'my-cli --type f --pattern ".md$" --grep "Table of Content"',
          comment:
            '## Search in all the markdown files under the `src` folder for the keywords "Table of Content"',
        },
      ],
      flags: {
        boring: {
          alias: "b",
          default: false,
          description: "Do not use color output",
          type: "boolean",
        },
        command: {
          alias: "c",
          description: "Command to execute over each node (ex: chmod +x)",
          type: "string",
        },
        dot: {
          default: false,
          description: "Show hidden files and directories",
          type: "boolean",
        },
        grep: {
          alias: "g",
          description:
            "A regular expression to match the content of the files found",
          type: "string",
        },
        help: {
          alias: "h",
          description: "Display help instructions",
          type: "boolean",
        },
        ignoreCase: {
          alias: "i",
          default: false,
          description: "Ignore case when searching",
          type: "boolean",
        },
        pattern: {
          alias: "p",
          description: "A regular expression to match file or folder names",
          type: "string",
        },
        short: {
          default: false,
          description: "Short listing format (equivalent to ls)",
          type: "boolean",
        },
        stats: {
          alias: "s",
          default: false,
          description: "Display some statistics",
          type: "boolean",
        },
        type: {
          alias: "t",
          description: "Search for files (f) or directories (d)",
          type: "string",
        },
        version: {
          alias: "v",
          description: "Output the current version",
          type: "boolean",
        },
      },
      parameters: {
        folder: {
          description: "some folder out of nowhere",
        },
        path: {
          default: "current folder",
          description: "the path where to search for files or directories",
        },
      },
      usage: "my-cli [options] <command> [path]",
    });

    expect(options).toStrictEqual({
      allowUnknownFlags: false,
      autoHelp: false,
      autoVersion: false,
      description: false,
      flags: {
        boring: {
          alias: "b",
          default: false,
          description: "Do not use color output",
          type: "boolean",
        },
        command: {
          alias: "c",
          description: "Command to execute over each node (ex: chmod +x)",
          type: "string",
        },
        dot: {
          default: false,
          description: "Show hidden files and directories",
          type: "boolean",
        },
        grep: {
          alias: "g",
          description:
            "A regular expression to match the content of the files found",
          type: "string",
        },
        help: {
          alias: "h",
          description: "Display help instructions",
          type: "boolean",
        },
        ignoreCase: {
          alias: "i",
          default: false,
          description: "Ignore case when searching",
          type: "boolean",
        },
        pattern: {
          alias: "p",
          description: "A regular expression to match file or folder names",
          type: "string",
        },
        short: {
          default: false,
          description: "Short listing format (equivalent to ls)",
          type: "boolean",
        },
        stats: {
          alias: "s",
          default: false,
          description: "Display some statistics",
          type: "boolean",
        },
        type: {
          alias: "t",
          description: "Search for files (f) or directories (d)",
          type: "string",
        },
        version: {
          alias: "v",
          description: "Output the current version",
          type: "boolean",
        },
      },
    });
    expect(helpText).toEqual(expect.stringContaining("  Usage:"));
    expect(helpText).toEqual(
      expect.stringContaining("> my-cli [options] <command> [path]")
    );
    expect(helpText).toEqual(
      expect.stringContaining(
        "  -b, --boring      Do not use color output                                       (default: false)"
      )
    );
    expect(helpText).toEqual(
      expect.stringContaining(
        "  -c, --command     Command to execute over each node (ex: chmod +x)"
      )
    );
    expect(helpText).toEqual(
      expect.stringContaining("  Folder:  some folder out of nowhere")
    );
    expect(helpText).toEqual(
      expect.stringContaining(
        "  Path:    the path where to search for files or directories  (default: current folder)"
      )
    );
    expect(helpText).toEqual(expect.stringContaining("  Examples:"));
    expect(helpText).toEqual(
      expect.stringContaining(
        '   ## Find files with the extension ".jsx" in the "src" folder'
      )
    );
    expect(helpText).toEqual(
      expect.stringContaining(
        '   > my-cli --type f --pattern=".sh$" --command "chmod +x"'
      )
    );
  });

  it("should return the right helpText for meow with no usage", async () => {
    const { helpText } = meowOptionsHelper({});
    expect(helpText).not.toEqual(expect.stringContaining("Usage:"));
  });

  it("should return the right helpText for meow with usage but no optional params", async () => {
    const { helpText } = meowOptionsHelper({
      usage: "my-cli <command>",
    });
    expect(helpText).toEqual(expect.stringContaining("Usage:"));
    expect(helpText).toEqual(expect.stringContaining("> my-cli <command>"));
  });

  it("should return the right helpText for meow with usage but no required params", async () => {
    const { helpText } = meowOptionsHelper({
      usage: "my-cli [options]",
    });
    expect(helpText).toEqual(expect.stringContaining("Usage:"));
    expect(helpText).toEqual(expect.stringContaining("> my-cli [options]"));
  });
});
