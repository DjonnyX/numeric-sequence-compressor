const SEPARATOR = '-', W_PATTERN = /([a-zA-Z])/;

/**
 * Serialization of a numeric array
 * @param {Array<number>} arr 
 * @param {string} separator optional
 * @returns 
 * @author djonnyx@gmail.com
 * Numeric array compressor
 * Compression quality is ~2 times better than the original sequence of numbers separated by separators
 * @example 
 * const arr = [0, 100, 25, 7, 47, 666];
 * const compressed = serialize(arr); 
 * console.log(compressed); // "0-34P7-1fkq"
 */
const serialize = (arr, separator = SEPARATOR) => {
    const result = [];
    arr.forEach(e => {
        const s = String(Number(e).toString(32));
        result.push(s);
        if (s.length < 2) {
            const lastChar = s.charAt(s.length - 1);
            if (W_PATTERN.test(lastChar)) {
                const v = s.substring(0, s.length - 2);
                result[result.length - 1] = `${v}${s.charAt(s.length - 1).toUpperCase()}`;
            } else {
                result.push(separator);
            }
        }
    });
    return result.join('');
}

/**
 * Deserializing a Numeric Array
 * @param {string} src 
 * @param {string} separator optional
 * @returns 
 * @example 
 * const compressed = "0-34P7-1fkq";
 * const arr: Array<number> = deserialize(compressed); 
 * console.log(arr); // "[0, 100, 25, 7, 47, 666]"
 */
const deserialize = (src, separator = SEPARATOR) => {
    const result = [];
    let value = '';
    for (let i = 0, l = src.length; i < l; i++) {
        const char = src[i], isSep = char === separator, isLastCharAsSep = W_PATTERN.test(char) && char === char.toUpperCase();
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
