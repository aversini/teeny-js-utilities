# [2.0.0](https://github.com/aversini/teeny-js-utilities/compare/v1.8.0...v2.0.0) (2021-02-13)


### Features

* runCommand will return { exitCode, shortMessage } if ignoreError is true ([d57ecd6](https://github.com/aversini/teeny-js-utilities/commit/d57ecd62bb18c4b2477da2f5186a056ef64fc61b))


### BREAKING CHANGES

* `ignoreError` used to simply ignore errors and prevented a throw (therefore always returning undefined on error). It is now returning an object containing the error code (exitCode) and the corresponding error message (shortMessage)



# [1.8.0](https://github.com/aversini/teeny-js-utilities/compare/v1.7.0...v1.8.0) (2021-02-12)


### Features

* meowOptionsHelper can build the usage string automatically ([050778f](https://github.com/aversini/teeny-js-utilities/commit/050778f3555dbcbadd8ed45968adf5021c3952ac))



# [1.7.0](https://github.com/aversini/teeny-js-utilities/compare/v1.6.0...v1.7.0) (2021-02-11)


### Features

* adding method meowParserHelper ([34e2707](https://github.com/aversini/teeny-js-utilities/commit/34e270740512968d7cc93d5c0974e0e882db7eaa))



# [1.6.0](https://github.com/aversini/teeny-js-utilities/compare/v1.5.0...v1.6.0) (2021-02-11)


### Features

* adding method meowOptionsHelper() ([6699a26](https://github.com/aversini/teeny-js-utilities/commit/6699a26c5f3880fdf26db57a0dfbdb6a6acfc653))



# [1.5.0](https://github.com/aversini/teeny-js-utilities/compare/v1.4.0...v1.5.0) (2021-02-07)


### Features

* adding method "parseGitHubURL()" ([beb8100](https://github.com/aversini/teeny-js-utilities/commit/beb8100c0c262f3a93a43d7a7087c8f1d7208237))



# [1.4.0](https://github.com/aversini/teeny-js-utilities/compare/v1.3.0...v1.4.0) (2021-02-07)


### Features

* adding method "isScopedPackage()" ([473612a](https://github.com/aversini/teeny-js-utilities/commit/473612a9544b1308af1e17ad147e4a88cef62bfa))



# [1.3.0](https://github.com/aversini/teeny-js-utilities/compare/v1.2.0...v1.3.0) (2021-02-06)


### Features

* adding method "kebabCase()" ([5d96c4f](https://github.com/aversini/teeny-js-utilities/commit/5d96c4fcfcb00d26e6eba6f32eff586f736243db))



# [1.2.0](https://github.com/aversini/teeny-js-utilities/compare/v1.1.4...v1.2.0) (2021-02-03)


### Features

* adding Performance class - a mini-wrapper wound node perf hooks ([6839f5c](https://github.com/aversini/teeny-js-utilities/commit/6839f5cb1605f81413638e5044eee4394659fece))



## [1.1.4](https://github.com/aversini/teeny-js-utilities/compare/v1.1.3...v1.1.4) (2021-02-03)


### Bug Fixes

* simplify printHTTPLogs by using logger built-in timestamp ([f33ff05](https://github.com/aversini/teeny-js-utilities/commit/f33ff054a2201cefdfcdfcb23e7d64c0fce787f9))



## [1.1.3](https://github.com/aversini/teeny-js-utilities/compare/v1.1.2...v1.1.3) (2021-02-02)


### Bug Fixes

* **runCommand:** better OS support by migrating to execa instead of exec ([f466c21](https://github.com/aversini/teeny-js-utilities/commit/f466c21daee4c758a5081c7acbe4ec5b4e7fa259))



## [1.1.2](https://github.com/aversini/teeny-js-utilities/compare/v1.1.1...v1.1.2) (2021-02-01)


### Bug Fixes

* trying to fix the auto-release ([66ec439](https://github.com/aversini/teeny-js-utilities/commit/66ec439d16100d0bb622c419e390276aba1ed4e8))



## [1.1.1](https://github.com/aversini/teeny-js-utilities/compare/v1.1.0...v1.1.1) (2021-02-01)


### Bug Fixes

* marking deepEqual method as private ([0fc6e38](https://github.com/aversini/teeny-js-utilities/commit/0fc6e38f035217210fbc6d8750d1778e4c886df5))



# [1.1.0](https://github.com/aversini/teeny-js-utilities/compare/v1.0.1...v1.1.0) (2021-02-01)


### Features

* **shallowMerge:** adding support for a customizer function (as in _.mergeWith) ([69b1acf](https://github.com/aversini/teeny-js-utilities/commit/69b1acfd9d245dce22c150b31b7ad46cb0fd0bbe))



## [1.0.1](https://github.com/aversini/teeny-js-utilities/compare/v1.0.0...v1.0.1) (2021-01-31)


### Bug Fixes

* trying to fix the release creating process ([bc5ba15](https://github.com/aversini/teeny-js-utilities/commit/bc5ba15dfdb2553e19322438d79ebec5657208bd))



# 1.0.0 (2021-01-31)

### Features

- first release - migrating utilities from other "teeny" packages ([eb94fb8c](https://github.com/aversini/teeny-js-utilities/commit/eaaa0a2803826d2051a9312f4c0e4792eb94fb8c))
