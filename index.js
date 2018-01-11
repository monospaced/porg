#! /usr/bin/env node

require("babel-register")({
  presets: [
    [
      "env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ]
});

const prettier = require("prettier");
const Svgo = require("svgo");
const svgo = new Svgo({
  plugins: [
    {
      convertShapeToPath: {
        convertArcs: true
      }
    }
  ]
});

const fs = require("fs");
const path = require("path");

const userArgs = process.argv.slice(2);
const pathName = userArgs[0];

if (!pathName) {
  throw new Error("Path argument not specified");
}

const processFile = file => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      throw err;
    }

    if (path.extname(file) === ".svg") {
      svgo.optimize(data).then(result => {
        const svg = result.data;
        const jsx = prettier.format(template(svg));
        const filename = file.replace(".svg", ".js");

        fs.writeFile(filename, jsx, "utf-8", err => {
          if (err) {
            throw err;
          }
        });
      });
    }
  });
};

if (fs.lstatSync(pathName).isDirectory()) {
  const directory = pathName.endsWith("/") ? pathName : `${pathName}/`;

  fs.readdir(directory, (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach(file => {
      processFile(`${directory}${file}`);
    });
  });
} else {
  processFile(pathName);
}

const template = svg => {
  return `
    import React from "react";

    const svg = () => (${svg});

    export default svg;
  `.trim();
};
