import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupGlobals from 'rollup-plugin-node-globals';
import rollupBuiltins from 'rollup-plugin-node-builtins';
import rollupReplace from '@rollup/plugin-replace';

const replace = fromRollup(rollupReplace);
const builtins = fromRollup(rollupBuiltins);
const commonjs = fromRollup(rollupCommonjs);
const globals = fromRollup(rollupGlobals);

export default [
  replace({
    'process.env.NODE_ENV': '"production"',
    'process.env.CONDUCTOR_URL': process.env.CONDUCTOR_URL
      ? `"${process.env.CONDUCTOR_URL}"`
      : 'undefined',
  }),
  builtins(),
  commonjs({
    include: [
      'node_modules/ieee754/**/*',
      'node_modules/base64-js/**/*',
      'node_modules/isomorphic-ws/**/*',
      'node_modules/buffer/**/*',
      'node_modules/@msgpack/**/*',
      'node_modules/@holochain/client/**/*',
    ],
  }),
  globals()
];
