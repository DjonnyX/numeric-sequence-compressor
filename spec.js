const { serialize, deserialize } = require('./index');

/** TESTS */
const BENCHMARK_ITERATIONS = 1000;

const specFill = () => {
    const result = [], l = 20 + Math.random() * 300;
    while (result.length < l) {
        result.push(Math.round(Math.random() * 1000));
    }
    return result;
}

const specGenerateListsForBenchmark = (iterations = BENCHMARK_ITERATIONS) => {
    const result = [];
    for (let i = 0, l = iterations; i < l; i++) {
        result.push(specFill());
    }
    return result;
}

const mesureCompression = (lists, withCapitalLatters = false) => {
    const iterations = lists.length;
    let summ = 0;
    for (let i = 0, l = iterations; i < l; i++) {
        const list = lists[i];
        summ += JSON.stringify(list).length / serialize(list, { caseSensetive: withCapitalLatters }).length
    }
    return `${Number(summ / iterations * 100).toFixed(2)} %`;
}

const deserializeMustBeCorrect = (lists, withCapitalLatters = false) => {
    const iterations = lists.length;
    let isCorrect = false;
    for (let i = 0, l = iterations; i < l; i++) {
        const list = lists[i];
        isCorrect = JSON.stringify(deserialize(serialize(list, { caseSensetive: withCapitalLatters }), { caseSensetive: withCapitalLatters })) === JSON.stringify(list);
        if (!isCorrect) {
            return isCorrect;
        }
    }
    return isCorrect;
}

const LISTS = specGenerateListsForBenchmark();

const isCorrect = (v, msg) => {
    if (v) {
        return `\x1b[32m ${msg} \x1b[0m`;
    }

    return `\x1b[41m ${msg} \x1b[0m`;
}

console.info(`Benchmark on ${LISTS.length} elements:`)
console.log(` - compression (With capital letters): \x1b[34m ${mesureCompression(LISTS, true)} \x1b[0m`);
console.log(` - compression (Lowercase letters only): \x1b[34m ${mesureCompression(LISTS, false)} \x1b[0m`);
const isCorrect1 = deserializeMustBeCorrect(LISTS, true);
console.log(isCorrect(isCorrect1, `- deserialize must be correct (With capital letters): ${isCorrect1}`));
const isCorrect2 = deserializeMustBeCorrect(LISTS, false);
console.log(isCorrect(isCorrect2, `- deserialize must be correct (Lowercase letters only): ${isCorrect2}`));
