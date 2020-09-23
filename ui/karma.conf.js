/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');
const { wrapRollupPlugin } = require('es-dev-server-rollup');
const commonjs = require('@rollup/plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const replace = require('@rollup/plugin-replace');

const e2e = process.env.E2E;
const testsPattern = `${e2e ? 'e2e' : 'test'}/**/*.test.js`;

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : testsPattern, type: 'module' },
      ],

      esm: {
        nodeResolve: {
          browser: true,
        },
        plugins: [
          wrapRollupPlugin(
            replace({
              global: 'window',
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
        ],
      },
      // you can overwrite/extend the config further
    })
  );
  return config;
};
