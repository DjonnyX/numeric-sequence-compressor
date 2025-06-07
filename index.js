const SEPARATOR = '-', W_PATTERN = /([a-zA-Z])/;

/**
 * @typedef {object} ISerializeOptions
 * @property {string} separator - A string character. An optional object property with a default value ("-")
 * @property {boolean} caseSensetive - If true, then capital letters will be used as separators whenever possible. An optional object property with a default value (true)
 */
const DEFAULT_SERIALIZE_OPTIONS = {
    separator: SEPARATOR,
    caseSensetive: true,
};

/**
 * Serialization of a numeric array
 * @param {Array<number>} arr 
 * @param {ISerializeOptions} options
 * @returns 
 * @author djonnyx@gmail.com
 * Numeric array compressor
 * Compression quality is ~2 times better than the original sequence of numbers separated by separators
 * @example 
 * const arr = [0, 100, 25, 7, 47, 666];
 * const compressed = serialize(arr); 
 * console.log(compressed); // "0-34P7-1fkq"
 */
const serialize = (arr, options = DEFAULT_SERIALIZE_OPTIONS) => {
    const opt = { ...DEFAULT_SERIALIZE_OPTIONS, ...options ?? {} }, result = [];
    arr.forEach(e => {
        const s = String(Number(e).toString(32));
        result.push(s);
        if (s.length < 2) {
            if (opt.caseSensetive) {
                const lastChar = s.charAt(s.length - 1);
                if (W_PATTERN.test(lastChar)) {
                    const v = s.substring(0, s.length - 2);
                    result[result.length - 1] = `${v}${s.charAt(s.length - 1).toUpperCase()}`;
                } else {
                    result.push(opt.separator);
                }
            } else {
                result.push(opt.separator);
            }
        }
    });
    return result.join('');
}

/**
 * Deserializing a Numeric Array
 * @param {string} src 
 * @param {ISerializeOptions} options
 * @returns 
 * @author djonnyx@gmail.com
 * @example 
 * const compressed = "0-34P7-1fkq";
 * const arr: Array<number> = deserialize(compressed); 
 * console.log(arr); // "[0, 100, 25, 7, 47, 666]"
 */
const deserialize = (src, options = DEFAULT_SERIALIZE_OPTIONS) => {
    const opt = { ...DEFAULT_SERIALIZE_OPTIONS, ...options ?? {} }, result = [];
    let value = '';
    for (let i = 0, l = src.length; i < l; i++) {
        const char = src[i], isSep = char === opt.separator,
            isLastCharAsSep = opt.caseSensetive && W_PATTERN.test(char) && char === char.toUpperCase();
        if (!isSep) {
            value += char;
        }
        if (isLastCharAsSep || value.length === 2 || (isSep && value.length === 1)) {
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
