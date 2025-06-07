const SEPARATOR = '-', DEFAULT_ZEROS_CHAR = '_', W_PATTERN = /([a-zA-Z])/;

/**
 * @typedef {object} ISerializeOptions
 * @property {string} separator - A string character. An optional object property with a default value ("-")
 * @property {string} zerosCharacter - A string character. An optional object property with a default value ("_")
 * @property {boolean} caseSensetive - If true, then capital letters will be used as separators whenever possible. An optional object property with a default value (true)
 */
const DEFAULT_SERIALIZE_OPTIONS = {
    separator: SEPARATOR,
    zerosCharacter: DEFAULT_ZEROS_CHAR,
    caseSensetive: true,
};

/**
 * @typedef {object} IDeserializeOptions
 * @property {string} separator - A string character. An optional object property with a default value ("-")
 * @property {string} zerosCharacter - A string character. An optional object property with a default value ("_")
 * @property {boolean} caseSensetive - If true, then capital letters will be used as separators whenever possible. An optional object property with a default value (true)
 * @property {number} maxValueInArray - Maximum value of an array element. An optional object property with a default value (1000)
 */
const DEFAULT_DESERIALIZE_OPTIONS = {
    separator: SEPARATOR,
    zerosCharacter: DEFAULT_ZEROS_CHAR,
    caseSensetive: true,
    maxValueInArray: 1000,
};

/**
 * @param {string} src
 * @param {number} max 
 * @returns {string}
 */
const fillWithZerosChars = (src, max, zerosCharacter = DEFAULT_ZEROS_CHAR) => {
    let result = src;
    while (result.length < max) {
        result = `${result}${zerosCharacter}`;
    }
    return result;
}

/**
 * Serialization of a numeric array
 * @param {Array<number>} arr 
 * @param {ISerializeOptions} options
 * @returns {string}
 * @author djonnyx@gmail.com
 * Numeric array compressor
 * Compression quality is ~2 times better than the original sequence of numbers separated by separators
 * @example 
 * const arr = [0, 100, 25, 7, 47, 666];
 * const compressed = serialize(arr); 
 * console.log(compressed); // "0-34P7-1fkq"
 */
const serialize = (arr, options = DEFAULT_SERIALIZE_OPTIONS) => {
    const opt = { ...DEFAULT_SERIALIZE_OPTIONS, ...(options ?? {}) }, result = [],
        max = Math.max(...arr), patternLength = String(max.toString(32)).length;
    for (let i = 0, l = arr.length, maxI = l - 1; i < l; i++) {
        const e = arr[i], s = String(Number(e).toString(32));
        // Если значения в диапазоне от 0 до 1000
        if (patternLength <= 2 || i === maxI) {
            result.push(s);
        }
        // Если значения в диапазоне от 1000 до Number.MAX_SAFE_INTEGER
        else {
            result.push(fillWithZerosChars(s, patternLength, opt.zerosCharacter));
        }
        const c = result[result.length - 1];
        if (c.length < patternLength) {
            if (opt.caseSensetive) {
                const lastChar = c.charAt(c.length - 1);
                if (W_PATTERN.test(lastChar)) {
                    const v = c.substring(0, c.length - 2);
                    result[result.length - 1] = `${v}${c.charAt(c.length - 1).toUpperCase()}`;
                    continue;
                }
            }
        }

        if (i !== maxI) {
            result.push(opt.separator);
        }
    }
    return result.join('');
}

/**
 * Deserializing a Numeric Array
 * @param {string} src 
 * @param {IDeserializeOptions} options
 * @returns {Array<number>}
 * @author djonnyx@gmail.com
 * @example 
 * const compressed = "0-34P7-1fkq";
 * const arr: Array<number> = deserialize(compressed); 
 * console.log(arr); // "[0, 100, 25, 7, 47, 666]"
 */
const deserialize = (src, options = DEFAULT_DESERIALIZE_OPTIONS) => {
    const opt = { ...DEFAULT_DESERIALIZE_OPTIONS, ...(options ?? {}) }, result = [],
        patternLength = String(opt.maxValueInArray.toString(32)).length;
    let value = '';
    for (let i = 0, l = src.length; i < l; i++) {
        const char = src[i];
        const isSep = char === opt.separator, isZeros = char === opt.zerosCharacter,
            isLastCharAsSep = opt.caseSensetive && W_PATTERN.test(char) && char === char.toUpperCase();
        if (!isSep && !isZeros) {
            value += char;
        }
        if (isLastCharAsSep || (value.length === patternLength) || (isSep && value.length > 0)) {
            result.push(Number.parseInt(value.toLowerCase(), 32));
            value = '';
        }
    }
    return result;
}

module.exports = {
    serialize,
    deserialize,
};
