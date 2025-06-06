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

const mesureCompression = (lists) => {
    const iterations = lists.length;
    let summ = 0;
    for (let i = 0, l = iterations; i < l; i++) {
        const list = lists[i];
        summ += JSON.stringify(list).length / serialize(list).length
    }
    return summ / iterations;
}

const deserializeMustBeCorrect = (lists) => {
    const iterations = lists.length;
    let isCorrect = false;
    for (let i = 0, l = iterations; i < l; i++) {
        const list = lists[i];
        isCorrect = JSON.stringify(deserialize(serialize(list))) === JSON.stringify(list);
        if (!isCorrect) {
            return isCorrect;
        }
    }
    return isCorrect;
}

const LISTS = specGenerateListsForBenchmark();

console.info(`Benchmark on ${LISTS.length} elements:`)
console.log(` - compression: ${mesureCompression(LISTS)}`);
console.log(` - deserialize must be correct: ${deserializeMustBeCorrect(LISTS)}`);
