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

const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const program = require("commander");
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

const convert = file => {
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

const template = svg => {
  return `
    import React from "react";

    const svg = () => (${svg});

    export default svg;
  `.trim();
};

program
  .arguments("<path>")
  .action(path => {
    pathValue = path;
  })
  .description("Convert SVG to JSX")
  .usage("[options] <path>")
  .version("0.0.0")
  .parse(process.argv);

if (typeof pathValue === "undefined") {
  console.error("path argument not supplied");
  process.exit(1);
}

if (fs.lstatSync(pathValue).isDirectory()) {
  const dir = pathValue.endsWith("/") ? pathValue : `${pathValue}/`;

  return fs.readdir(dir, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach(file => {
      convert(`${dir}${file}`);
    });
  });
}

return convert(pathValue);
