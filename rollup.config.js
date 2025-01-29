import { readFileSync } from 'node:fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

// Read package.json
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// Generate a timestamp for cache busting
const timestamp = new Date().getTime();

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/printwatch-card.js',
    format: 'es',
    sourcemap: true,
    banner: `/**
 * PrintWatch Card ${pkg.version}
 * Built: ${new Date().toISOString()}
 */`
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    replace({
      preventAssignment: true,
      values: {
        'process.env.VERSION': JSON.stringify(pkg.version),
        'process.env.BUILD_TIMESTAMP': JSON.stringify(timestamp)
      }
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser({
      format: {
        comments: /PrintWatch Card/
      }
    })
  ]
};