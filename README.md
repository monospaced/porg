Porg
====

Convert SVG to JSX.

Dependencies
------------

git | node 8 | npm

yarn `brew install yarn --without-node`

Installation
------------

````
$ git clone git@github.com:monospaced/porg.git
$ cd porg
$ yarn && yarn link
````

Usage
-----

````
$ porg <path>
````

Examples
--------

### File

```
$ porg ./test/test.svg

./test/test.js
```

### Directory

````
$ porg ./test

./test/test.js
./test/etc.js
…
````  
