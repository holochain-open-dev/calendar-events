import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const pkg = require('./package.json');

export default {
  input: `src/index.ts`,
  output: [{ dir: 'dist', format: 'es', sourcemap: true }],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash-es')
  external(id) {
    if (id.includes('./') || id.startsWith('/') || id.includes('@fullcalendar') || id.endsWith('.css')) return false;
    return true;
  },
  watch: {
    include: 'src/**',
  },
  plugins: [
    postcss({
      inject: false,
    }),
    postcssLit(),
    typescript({}),
    resolve({
      dedupe: ['lit-html', 'lit-element'],
    }),
    commonjs({
      include: [],
    }),
  ],
};
