# uuid-validator

[![Build Status](https://travis-ci.org/WatchBeam/uuid-validate.svg)](https://travis-ci.org/WatchBeam/uuid-validate)

Useful little package to validate UUIDs in Node.js. Usage:

```js
var validate = require('uuid-validate');

// Let's validate a uuid version 1. If we don't pass a version, it'll
// infer it based on the uuid itself.
validate('95ecc380-afe9-11e4-9b6c-751b66dd541e'); // => true

// We can tell it what version to expect, and if it gets the wrong
// version, it'll return false.
validate('95ecc380-afe9-11e4-9b6c-751b66dd541e', 1); // => true (it's version 1)
validate('95ecc380-afe9-11e4-9b6c-751b66dd541e', 4); // => false (it's not version 4)

// You can also pass buffers instead of strings.
// This works for UUID versions 1 through 4

// If you want to find out what version a UUID is:
validate.version('95ecc380-afe9-11e4-9b6c-751b66dd541e'); // => 1
```
