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
const recurse = require("recursive-readdir");
const Svgo = require("svgo");
const svgo = new Svgo({
  plugins: [
    {
      convertShapeToPath: {
        convertArcs: true
      }
    },
    {
      removeDimensions: true
    },
    {
      removeViewBox: false
    }
  ]
});
const svgtojsx = require("svg-to-jsx");

const convert = file => {
  if (
    !fs.existsSync(file) ||
    fs.lstatSync(file).isDirectory() ||
    path.extname(file) !== ".svg"
  ) {
    return;
  }

  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    const extname = path.extname(file);

    if (extname === ".svg") {
      svgo
        .optimize(data)
        .then(result => {
          const svg = result.data;

          svgtojsx(svg)
            .then(jsx => {
              const displayName = `${
                program.prefix ? program.prefix : ""
              }${pascalCase(path.basename(file, extname))}`;
              const js = prettier.format(template(jsx, displayName));
              const filename = file.replace(".svg", ".js");

              fs.writeFile(filename, js, "utf-8", err => {
                if (err) {
                  throw err;
                }

                if (program.delete) {
                  fs.unlink(file, err => {
                    if (err) {
                      throw err;
                    }
                  });
                }
              });
            })
            .catch(err => {
              throw err;
            });
        })
        .catch(err => {
          console.error(err);
        });
    }
  });
};

const pascalCase = string => {
  return string
    .match(/[a-z0-9]+/gi)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join("");
};

const template = (jsx, displayName) => {
  return `import PropTypes from "prop-types";import React from "react";import Svg from "@wel-ui/component-svg";const Icon = props => <Svg {...props}>{Icon.svg}</Svg>;

  Icon.propTypes = {height: PropTypes.number,label: PropTypes.string,width: PropTypes.number};Icon.displayName = "${displayName}";Icon.svg = ${jsx};export default Icon;`;
};

program
  .arguments("<path>")
  .action(path => {
    pathValue = path;
  })
  .description("Convert SVG to JSX")
  .option("-d, --delete", "delete source file(s)")
  .option("-p, --prefix [string]", "prefix component displayName [Expressive]")
  .option("-r, --recursive", "process folders recursively")
  .usage("[options] <path>")
  .version("0.0.0")
  .parse(process.argv);

if (typeof pathValue === "undefined") {
  console.error("path argument not supplied");
  process.exit(1);
}

if (fs.lstatSync(pathValue).isDirectory()) {
  if (program.recursive) {
    return recurse(pathValue, (err, files) => {
      if (err) {
        throw err;
      }

      files.forEach(file => convert(file));
    });
  }

  return fs.readdir(pathValue, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach(file => convert(path.join(pathValue, file)));
  });
}

return convert(pathValue);
