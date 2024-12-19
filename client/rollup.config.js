import { terser } from '@rollup/plugin-terser';

export default {
  input: 'build/static/js/main.js',
  output: {
    file: 'build/static/js/main.min.js', 
    format: 'esm',
  },
  plugins: [terser()]
};
