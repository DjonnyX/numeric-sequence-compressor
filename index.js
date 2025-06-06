/**
 *  Компрессор числовых массивов
 *  Качество сжатия ~ в 2 раза от исходной разделенной сепараторами последовательности чисел
 */

const SEPARATOR = '-';

/**
 * Сереализация чиселового массива
 * @param {Array<number>} arr 
 * @param {string} separator опциональный
 * @returns 
 */
const serialize = (arr, separator = SEPARATOR) => {
    const result = [];
    arr.forEach(e => {
        const s = String(Number(e).toString(32));
        result.push(s);
        if (s.length < 2) {
            result.push(separator);
        }
    });
    return result.join('');
}

/**
 * Десериализация числового массива
 * @param {string} src 
 * @param {string} separator опциональный
 * @returns 
 */
const deserialize = (src, separator = SEPARATOR) => {
    const result = [];
    let value = '';
    for (let i = 0, l = src.length; i < l; i++) {
        const char = src[i], isSep = char === separator;
        if (!isSep) {
            value += char;
        }
        if ((isSep && value.length === 1) || value.length === 2) {
            result.push(Number.parseInt(value, 32));
            value = '';
        }
    }
    return result;
}

module.exports = {
    serialize,
    deserialize,
};
