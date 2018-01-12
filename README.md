# Porg

Convert SVG to JSX

![porg.svg](porg.svg)

From `.svg`

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <g>…</g>
</svg>
```

To `.js`

```js
import React from "react";

export default = (
  <svg xmlns="http://www.w3.org/2000/svg">
    <g>…</g>
  </svg>
);
```

## Usage

```
$ porg [options] <path>

Options:

    -d, --delete   delete source file(s)
    -V, --version  output the version number
    -h, --help     output usage information
```

## Dependencies

git | node 8 | npm

yarn `brew install yarn --without-node`

## Installation

```
$ git clone git@github.com:monospaced/porg.git
$ cd porg
$ yarn && yarn link
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
