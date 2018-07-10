const { getBaseBabelConfig } = require('@socifi/rollup-config/src/helpers');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');

export default {
    treeshake: {
        propertyReadSideEffects: false,
    },
    plugins: [
        resolve({
            modulesOnly: true,
            customResolveOptions: {
                moduleDirectory: 'src',
            },
            extensions: ['.js', '.jsx'],
        }),
        babel(getBaseBabelConfig(false, {
            node: '9.6.1',
        })),
    ],
    input: './src/index.js',
    output: {
        file: './build/index.js',
        format: 'cjs',
    },
};
