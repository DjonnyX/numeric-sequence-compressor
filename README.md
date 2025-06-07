# Numeric sequence compressor

Numeric array compressor
Compression quality is ~ 2 times better than the original separator-separated sequence of numbers

![image](https://github.com/user-attachments/assets/ca97c46a-9c94-4fef-91b0-0c0b6e022a7f)

__Important! The algorithm works correctly when the range of numbers in the array is from 0 to 1000.__


## Example

Install

```bash
npm i numeric-sequence-compressor
```

Import dependency to Your project:
```ts
const { serialize, deserialize } = require('numeric-sequence-compressor');
```

Serialization (Compression):
```ts
const arr = [0, 100, 25, 7, 47, 666];
const compressed = serialize(arr); 
console.log(compressed); // "0-34P7-1fkq"
```

Deserialization (Decompression):
```ts
const compressed = "0-34P7-1fkq";
const arr = deserialize(compressed); 
console.log(arr); // "[0, 100, 25, 7, 47, 666]"
```


## Tests & benchmark

To run the benchmark with tests, run the command:

```bash
npm start
```
или
```bash
npm run test
```
