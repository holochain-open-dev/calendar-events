const { wrapRollupPlugin } = require('es-dev-server-rollup');
const commonjs = require('@rollup/plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const replace = require('@rollup/plugin-replace');

module.exports = [
  wrapRollupPlugin(
    replace({
      global: 'window',
      'process.env.NODE_ENV': '"development"',
    })
  ),
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
];
