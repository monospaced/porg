# Porg

Convert SVG to JSX.

## Dependencies

git | node 8 | npm

yarn `brew install yarn --without-node`

## Installation

```
$ git clone git@github.com:monospaced/porg.git
$ cd porg
$ yarn && yarn link
```

## Usage

```
$ porg [options] <path>

Options:

    -d, --delete   delete source file(s)
    -V, --version  output the version number
    -h, --help     output usage information
```

## Examples

### File

```
$ porg ./test/test.svg

./test/test.js
```

### Directory

```
$ porg ./test

./test/test.js
./test/etc.js
…
```
