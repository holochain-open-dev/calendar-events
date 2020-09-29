import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';

const pkg = require('./package.json');

export default {
  input: `src/index.ts`,
  output: [{ dir: 'dist', format: 'es', sourcemap: true }],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash-es')
  external: [
    ...Object.keys(pkg.dependencies || {}).filter(key => !key.includes('tui')),
    ...Object.keys(pkg.peerDependencies || {}),
    '@apollo/client/core',
  ],
  watch: {
    include: 'src/**',
  },
  context: 'window',
  plugins: [
    postcss({
      inject: false,
    }),
    postcssLit(),
    typescript({}),
    resolve({}),
    commonjs({
      include: [
        'node_modules/tui-calendar/**/*',
        'node_modules/tui-code-snippet/**/*',
      ],
    }),
  ],
};
