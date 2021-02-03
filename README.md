# Teeny JavaScript Utilities

![npm](https://img.shields.io/npm/v/teeny-js-utilities?label=version&logo=npm)
![David](https://img.shields.io/david/aversini/teeny-js-utilities?logo=npm)
![David](https://img.shields.io/david/dev/aversini/teeny-js-utilities?logo=npm)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/aversini/teeny-js-utilities/coverage?label=coverage&logo=github)
![Codacy grade](https://img.shields.io/codacy/grade/150b9c96510247b7917a6be9510e3395?logo=codacy)

> Teeny JavaScript Utilities is a package helper providing common utilities for other node packages.

## Table of Content

- [Installation](#installation)
- [API](#api)
  - [displayErrorMessages](#displayerrormessages)
  - [printHTTPLogs](#printhttplogs)
  - [runCommand](#runcommand)
  - [Performance](#performance)
  - [shallowMerge](#shallowmerge)
  - [Spinner](#spinner)
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

NOTE: if `messages` is not an array, or is an empty array, the method does nothing.

#### Arguments

| Argument   | Type              | Default |
| ---------- | ----------------- | ------- |
| messages   | Array of String   | [ ]     |
| exitStatus | Number or Boolean | 0       |

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

#### Examples

```js
const { runCommand } = require("teeny-js-utilities");
const { stdout, stderr } = await runCommand("npm config ls", { verbose: true });
const res = await runCommand("git add -A && git commit -a -m 'First commit'");
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
