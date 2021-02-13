
### Features

* runCommand will return { exitCode, shortMessage } if ignoreError is true ([d57ecd6](https://github.com/aversini/teeny-js-utilities/commit/d57ecd62bb18c4b2477da2f5186a056ef64fc61b))


### BREAKING CHANGES

* `ignoreError` used to simply ignore errors and prevented a throw (therefore always returning undefined on error). It is now returning an object containing the error code (exitCode) and the corresponding error message (shortMessage)

