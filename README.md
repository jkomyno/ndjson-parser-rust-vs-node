# NDJSON Parser: A Rust vs Node.js comparison

----

This repository contains two different implementations of a NDJSON parser: one in [Rust](./rust) and one in [JavaScript/Node.js](./nodejs/).
The goal of this repository is to compare the performance of both implementations.

All benchmarks were run on a MacBook Pro M1 2021 with 32GB of RAM.

## Getting started

- Copy your local `data.jsonl` file to `./data/data.jsonl`
- Install `node@18.8.0`
- Install `rust@1.65.0`

## Node.js

### How to run

```bash
cd nodejs
npm i
time node parser.mjs
```

The benchmark results should look like the following:

```bash
node parser.mjs  7.47s user 1.14s system 106% cpu 8.097 total
```

You can find the output file in `./data/output/parsed-js.json`.

### Alternative writestream implementation

```bash
time node parser-writestream.mjs
```

The benchmark results should look like the following:

```bash
node parser-writestream.mjs  6.78s user 0.86s system 103% cpu 7.411 total
```

You can find the output file in `./data/output/parsed-js.json`.

## Rust

### How to run

```bash
cd rust
cargo build --release
./target/release/ndjson-parser
```

The benchmark results should look like the following:

```bash
./target/release/ndjson-parser  1.78s user 0.38s system 97% cpu 2.205 total
```

You can find the output file in `./data/output/parsed-rust.json`.

## Conclusion

The Rust implementation is around 3 times faster than the fastest Node.js implementation.
