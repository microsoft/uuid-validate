// Regular expression used for basic parsing of the uuid.
var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Unparses a UUID buffer to a string. From node-uuid:
 * https://github.com/defunctzombie/node-uuid/blob/master/uuid.js
 *
 * Copyright (c) 2010-2012 Robert Kieffer
 * MIT License - http://opensource.org/licenses/mit-license.php
 *
 * @param  {Buffer} buf
 * @param  {Number=0} offset
 * @return {String}
 */
var _byteToHex = [];
for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

/**
 * Determines whether the uuid is valid, converting
 * it from a buffer if necessary.
 *
 * @param  {String|Buffer}  uuid
 * @param  {Number=}  version
 * @return {Boolean}
 */
module.exports = function (uuid, version) {
    var parsedUuid;
    // If the uuid is a biffer, parse it...
    if (Buffer.isBuffer(uuid)) {
        parsedUuid = unparse(uuid);
    }
    // If it's a string, it's already good.
    else if (Object.prototype.toString.call(uuid) === '[object String]') {
        parsedUuid = uuid;
    }
    // Otherwise, it's not valid.
    else {
        return false;
    }

    parsedUuid = parsedUuid.toLowerCase();

    // All UUIDs fit a basic schema. Match that.
    if (!pattern.test(parsedUuid)) {
        return false;
    }

    // Now extract the version...
    if (version === undefined) {
        version = extractVersion(parsedUuid);
    } else if (extractVersion(parsedUuid) !== version) {
        return false;
    }

    switch (version) {
        // For certain versions, the checks we did up to this point are fine.
        case 1:
        case 2:
            return true;

        // For versions 3 and 4, they must specify a variant.
        case 3:
        case 4:
        case 5:
            return ['8', '9', 'a', 'b'].indexOf(parsedUuid.charAt(19)) !== -1;

        default:
            // We should only be able to reach this if the consumer explicitly
            // provided an invalid version. Prior to extractVersion we check
            // that it's 1-4 in the regex.
            throw new Error('Invalid version provided.');
    }
};

/**
 * Extracts the version from the UUID, which is (by definition) the M in
 * xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
 *
 * @param  {String} uuid
 * @return {Number}
 */
var extractVersion = module.exports.version = function (uuid) {
    return uuid.charAt(14)|0;
};
