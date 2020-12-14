import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

export default {
  input: `src/bundle.ts`,
  output: [{ dir: './bundle', format: 'es', sourcemap: true }],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash-es')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    replace({
      'window.customElements.define(tagName, clazz);': '',
      delimiters: ['', ''],
    }),
    postcss({
      inject: false,
    }),
    postcssLit(),
    typescript({
      outDir: 'bundle'
    }),
    resolve({}),
    commonjs({
      include: [],
    }),
    terser(),
  ],
};
