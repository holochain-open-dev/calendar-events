const { wrapRollupPlugin } = require('es-dev-server-rollup');
const commonjs = require('@rollup/plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');

module.exports = {
  port: 8080,
  watch: true,
  nodeResolve: true,
  appIndex: 'demo/index.html',
  open: true,
  plugins: [
    wrapRollupPlugin(builtins()),
    wrapRollupPlugin(
      commonjs({
        include: [
          'node_modules/fast-json-stable-stringify/**/*',
          'node_modules/zen-observable/**/*',
          'node_modules/graphql-tag/**/*',
          'node_modules/isomorphic-ws/**/*',
          'node_modules/@msgpack/**/*',
        ],
      })
    ),
  ],
  moduleDirs: ['node_modules', 'web_modules'],
};
