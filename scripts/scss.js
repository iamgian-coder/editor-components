#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const fse = require("fs-extra");
const cp = require("child_process");

const cwd = process.cwd();
const src = path.join(cwd, "src");
const esm = path.join(cwd, "dist", "esm");
const cjs = path.join(cwd, "dist", "cjs");
const umd = path.join(cwd, "dist", "umd");

function compile(source, target) {
  let cmd = "./node_modules/.bin/node-sass";
  if (os.type() === "Windows_NT") {
    cmd = path.join(cwd, "./node_modules/.bin/node-sass.cmd");
  }
  cp.execFileSync(cmd, [source, target]);
}

// Copy scss files
function readdir(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const sub = path.join(dir, file);
      const stat = fs.statSync(sub);
      if (stat && stat.isDirectory()) {
        readdir(sub);
      } else {
        const ext = path.extname(file);
        if (ext === ".scss" || ext === ".css") {
          const scss = path.relative(src, sub);
          const name = scss.substr(0, scss.length - ext.length);
          fse.copySync(sub, path.join(esm, scss));
          fse.copySync(sub, path.join(cjs, scss));

          compile(sub, path.join(esm, `${name}.css`));
          compile(sub, path.join(cjs, `${name}.css`));
        }
      }
    });
  }
}

function rollup() {
  let content = "";
  fs.readdir(src, (err, files) => {
    files.forEach((file) => {
      let sub = path.join(file, "style", "index.scss");
      if (fs.existsSync(path.join(src, sub))) {
        sub = sub.split(path.sep).join("/");
        //把每个组件下style/index.scss的文件信息追加到content变量下
        content += `@import "../${sub}";\n`;
      }
    });

    let source = path.join(esm, "style", "components.scss");
    fs.writeFileSync(source, content);
    console.log("generate dist/esm/style/components.scss");

    fs.writeFileSync(path.join(cjs, "style", "components.scss"), content);
    console.log("generate dist/cjs/style/components.scss");

    compile(source, path.join(esm, "style", "components.css"));
    console.log("generate dist/esm/style/components.css");

    compile(source, path.join(cjs, "style", "components.css"));
    console.log("generate dist/cjs/style/components.css");

    compile(source, path.join(umd, "index.css"));
    console.log("generate dist/umd/index.css");
  });
}

console.log("Build scss files");
fs.readdir(src, (err, files) => {
  files.forEach((file) => {
    const dir =
      file === "style" ? path.join(src, file) : path.join(src, file, "style");
    //dir最终就是样式文件夹
    readdir(dir);
  });
  rollup();
});
