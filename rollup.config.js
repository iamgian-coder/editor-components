import peerDepsExternal from "rollup-plugin-peer-deps-external";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        name: "EditorComponents",
        format: "umd",
        file: "dist/umd/editor-components.js",
        sourcemap: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    ],
    external: ["react", "react-dom"],
    plugins: [
      peerDepsExternal(),
      typescript({ declaration: false }),
      resolve(),
      commonjs(),
      postcss({
        plugins: [autoprefixer(), cssnano()],
      }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      terser(),
    ],
  },
];
