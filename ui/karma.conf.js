/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

const e2e = process.env.E2E;

function testFilePatterns() {
  const base = ['test/**/*.test.js'];
  if (e2e) base.push('e2e/**/*.test.js');
  return base;
}

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: testFilePatterns().map(pattern => ({
        pattern: config.grep ? config.grep : pattern,
        type: 'module',
      })),

      esm: {
        nodeResolve: {
          browser: true,
        },
        plugins: require('./es-dev-plugins'),
      },
      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 20,
            branches: 20,
            functions: 20,
            lines: 20,
          },
        },
      },

      // you can overwrite/extend the config further
    })
  );
  return config;
};
