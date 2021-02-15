# Teeny JavaScript Utilities

![npm](https://img.shields.io/npm/v/teeny-js-utilities?label=version&logo=npm)
![David](https://img.shields.io/david/aversini/teeny-js-utilities?logo=npm)
![David](https://img.shields.io/david/dev/aversini/teeny-js-utilities?logo=npm)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/aversini/teeny-js-utilities/coverage?label=coverage&logo=github)

> Teeny JavaScript Utilities is a package helper providing common utilities for other node packages.

## Table of Content

- [Installation](#installation)
- [API](#api)
  - [displayErrorMessages](#displayerrormessages)
  - [isScopedPackage](#isscopedpackage)
  - [kebabCase](#kebabcase)
  - [meowOptionsHelper](#meowoptionshelper)
  - [meowParserHelper](#meowparserhelper)
  - [parseGitHubURL](#parsegithuburl)
  - [printHTTPLogs](#printhttplogs)
  - [runCommand](#runcommand)
  - [Performance](#performance)
  - [shallowMerge](#shallowmerge)
  - [Spinner](#spinner)
  - [uniqueID](#uniqueid)
  - [upperFirst](#upperfirst)
- [License](#license)

## Installation

```sh
> cd your-project
> npm install --save teeny-js-utilities
```

## API

### displayErrorMessages

**displayErrorMessages(messages, [exitStatus])**

Log multiple error messages at the prompt using `console.error` behind the scenes. If `exitStatus` is a number, the process will exit with this value. Use "false" to prevent the process from terminating.

#### Arguments

| Argument   | Type              | Default |
| ---------- | ----------------- | ------- |
| messages   | Array of String   | [ ]     |
| exitStatus | Number or Boolean | 0       |

#### Note

If `messages` is not an array, or is an empty array, the method does nothing.

### isScopedPackage

**isScopedPackage(str) ⇒ `boolean`**

Check if a string represents a scoped package name.

#### Arguments

| Argument | Type   | Default |
| -------- | ------ | ------- |
| str      | String | ""      |

#### Examples

```js
const { isScopedPackage } = require("teeny-js-utilities");
isScopedPackage("@versini/my-package");
//-> true
isScopedPackage("my-package");
//-> false
```

### kebabCase

**kebabCase(str) ⇒ `string`**

Convert the string to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).

#### Arguments

| Argument | Type   | Default |
| -------- | ------ | ------- |
| str      | String | ""      |

#### Examples

```js
const { kebabCase } = require("teeny-js-utilities");
const str = kebabCase("hello beautiful world!");
// str is "hello-beautiful-world"
```

### meowOptionsHelper

**meowOptionsHelper({ examples, flags, parameters, usage }) ⇒ `object`**

Helper to format options for [meow](https://github.com/sindresorhus/meow), a CLI helper.

#### Arguments

| Argument           | Type              | Default |
| ------------------ | ----------------- | ------- |
| options            | Object            | {}      |
| options.examples   | Array of Object   | [{}]    |
| options.flags      | Object            | {}      |
| options.parameters | Object            | {}      |
| options.usage      | String or Boolean |         |

#### Example

```js
const cli = require("meow");
const { meowOptionsHelper } = require("teeny-js-utilities");
const { helpText, options } = meowOptionsHelper({
  examples: [
    {
      command: 'my-cli --command "chmod +x" bin',
      comment: '## Make all files executable in the "bin" folder',
    },
  ],
  flags: {
    command: {
      alias: "c",
      description: "Command to execute over each node (ex: chmod +x)",
      type: "string",
    },
    help: {
      alias: "h",
      description: "Display help instructions",
      type: "boolean",
    },
    version: {
      alias: "v",
      description: "Output the current version",
      type: "boolean",
    },
  },
  parameters: {
    src: {
      default: "current folder",
      description: "the source",
    },
    dest: {
      description: "the destination",
    },
  },
  // use usage:true is equivalent to the next line
  usage: "my-cli [options] [src] [dest]",
});
```

### meowParserHelper

**meowParserHelper({ cli, restrictions })**

Helper to parse options for [meow](https://github.com/sindresorhus/meow), a CLI helper.

#### Arguments

| Argument               | Type            | Default                                |
| ---------------------- | --------------- | -------------------------------------- |
| cli                    | Object          | received from meow(helpText, options); |
| restrictions           | Array of Object | [{}]                                   |
| restrictions[].exit    | Number          | undefined                              |
| restrictions[].message | Function        | () => {}                               |
| restrictions[].test    | Function        | () => {}                               |

#### Note

If options `--version` or `--help` are used, they will automatically trigger calls to `meow.showVersion()` and `meow.showHelp()`, respectively, and exit with 0 (`process.exit(0)`).

#### Example

```js
const cli = require("meow");
const { meowOptionsHelper, meowParserHelper } = require("teeny-js-utilities");

// Configure options with meowOptionsHelper (see above)
// and then parse the results via meowParserHelper
const { helpText, options } = meowOptionsHelper({ ... });
const cli = meow(helpText, options);
meowParserHelper({
  cli,
  restrictions: [
    {
      exit: 1,
      message: (flag) => `Error: option '${flag.type}' is invalid`,
      test: (flag) => flag.type !== "d" && flag.type !== "f",
    },
  ],
});
```

### parseGitHubURL

**parseGitHubURL(url, options) ⇒ `object`**

Parse a GitHub URL and tries to extract the following GitHub values:

- results.host: the hostname
- results.href: the normalized URL
- results.name: the name of the package
- results.owner: the owner of the package (think GitHub username)
- results.repo: the name of the repository

#### Arguments

| Argument | Type   | Default                                             |
| -------- | ------ | --------------------------------------------------- |
| url      | String | ""                                                  |
| options  | Object | { "baseUrls": [ "gist.github.com", "github.com" ] } |

#### Examples

```js
const { parseGitHubURL } = require("teeny-js-utilities");
const results = parseGitHubURL(
  "git@github.com:aversini/teeny-js-utilities.git"
);
/**
 * results is:
 * {
 *   host: 'github.com',
 *   href: 'https://github.com/aversini/teeny-js-utilities',
 *   name: 'teeny-js-utilities',
 *   owner: 'aversini',
 *   repo: 'aversini/teeny-js-utilities'
 * }
 */
```

### printHTTPLogs

**printHTTPLogs(req)**

Log simplified HTTP logs at the prompt, extracting only the method and the url from the argument. Each log is prefixed with a locally formatted timestamp.

#### Arguments

| Argument   | Type   | Default |
| ---------- | ------ | ------- |
| req        | Object | { }     |
| req.method | String | ""      |
| req.url    | String | ""      |

#### Example

```js
const { printHTTPLogs } = require("teeny-js-utilities");
printHTTPLogs({ method: "GET", path: "/api" });
printHTTPLogs({ method: "GET", path: "/404.html" });
```

will print something approaching this at the prompt:

```sh
[ Sat Oct 31 2020 5:02:27 PM ] GET /api
[ Sat Oct 31 2020 5:02:28 PM ] GET /404.html
```

### runCommand

**runCommand(command, options) ⇒ `Promise <string>` | `Promise <object>`**

Runs a shell command asynchronously and depending on the options, returns `stdout` as a string, or both `stdout` and `stderr` as an object if the `option.verbose` flag is true.
If the command fails to run (invalid command or the commands status is anything but 0), the call will throw an exception. The exception can be ignored if the `options.ignoreError` flag is true.

#### Arguments

| Argument            | Type    | Default |
| ------------------- | ------- | ------- |
| command             | String  | ""      |
| options             | Object  | { }     |
| options.verbose     | Boolean | false   |
| options.ignoreError | Boolean | false   |

#### Note

If `ignoreError` is used, the method will not throw but will instead return an object with the keys `exitCode` and `shortMessage`.

#### Examples

```js
const { runCommand } = require("teeny-js-utilities");
const { stdout, stderr } = await runCommand("npm config ls", { verbose: true });
// -> verbose means the command return an object with stdout and stderr
const stdout = await runCommand(
  "git add -A && git commit -a -m 'First commit'"
);
// -> non-verbose means the command returns stdout directly
```

```js
const { runCommand } = require("teeny-js-utilities");
const { exitCode, shortMessage } = await runCommand("ls /not-a-folder", {
  ignoreError: true,
});
// -> exitCode is 1 and shortMessage is "Command failed with exit code 1: ls /not-a-folder"
```

### Performance

Performance is a wrapper around nodejs Performance measurement APIs.

It provides a highly simplified class for an extremely simple case:

- start performance monitoring
- do something that takes a while
- stop performance monitoring
- read how much time passed between start and stop (in milliseconds)

#### Example

```js
const { Performance } = require("teeny-js-utilities");
const perf = new Performance();

// somewhere in your code, you want to start measuring performance:
perf.start();
// do long lasting actions
(...)
// when done, tell performance to stop:
perf.stop();
// the duration can now be found in the Performance class getter `results`:
console.log(`It took ${perf.results.duration} milliseconds to run...`);
```

### shallowMerge

**shallowMerge(objA, objB, customizer) ⇒ <code>object</code>**

Wrapper method for lodash `merge()` and `mergeWith()` methods.

Without the `customizer` function, this method recursively merges own and inherited enumerable string keyed properties of source objects into the destination object. Source properties that resolve to undefined are skipped if a destination value exists. Array and plain object properties are merged recursively. Other objects and value types are overridden by assignment. Source objects are applied from left to right. Subsequent sources overwrite property assignments of previous sources.

With the `customizer` function, the behavior is the same except that `customizer` is invoked to produce the merged values of the destination and source properties. If customizer returns undefined, merging is handled by the `shallowMerge` instead. The customizer is invoked with six arguments: `(objValue, srcValue, key, object, source, stack)`

WARNING: this method will mutate objA!

#### Arguments

| Argument   | Type     | Default   |
| ---------- | -------- | --------- |
| objA       | Object   | {}        |
| objB       | Object   | {}        |
| customizer | Function | undefined |

#### Examples

```js
const { shallowMerge } = require("teeny-js-utilities");
const objA = { port: 123, cache: false, gzip: true };
const objB = { port: 456, gzip: false };
const objC = shallowMerge(objA, objB);

// objC is { port: 456, cache: false, gzip: false };
```

```js
const { shallowMerge } = require("teeny-js-utilities");
const objA = { a: [1], b: [2] };
const objB = { a: [3], b: [4] };
const objC = shallowMerge(objA, objB, (objValue, srcValue) => {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
});

// objC is { 'a': [1, 3], 'b': [2, 4] };
```

### Spinner

Spinner is an "elegant terminal spinner", relying behind the scenes on the excellent [ora](https://github.com/sindresorhus/ora)

#### Example

```js
const { Spinner } = require("teeny-js-utilities");
const spinner = new Spinner("Updating package.json...");
// long running process...
spinner.text = "Git stage and commit, please wait...")
// long running process...
spinner.text = "Almost there..."
// long running process...
if (success) {
  spinner.succeed("Process completed successfully!");
} else {
  spinner.fail("Process failed miserably...");
}
```

### uniqueID

**uniqueID(prefix) ⇒ `string`**

Generates a unique ID. If prefix is given, the ID is appended to it.

#### Arguments

| Argument | Type   | Default |
| -------- | ------ | ------- |
| prefix   | String | ""      |

#### Examples

```js
const { uniqueID } = require("teeny-js-utilities");
const str = uniqueID("some-prefix-");
// str looks like: "some-prefix-28834903784521426'
```

### upperFirst

**upperFirst(str) ⇒ `string`**

Capitalize the first letter of the provided string (but not all the words).

#### Arguments

| Argument | Type   | Default |
| -------- | ------ | ------- |
| str      | String | ""      |

#### Examples

```js
const { upperFirst } = require("teeny-js-utilities");
const str = upperFirst("hello world");
// str is "Hello world"
```

## License

MIT © Arno Versini
