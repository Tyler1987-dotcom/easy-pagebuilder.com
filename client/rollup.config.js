import terser from '@rollup/plugin-terser'; // Remove the destructuring
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js', // Your entry point
  external: ['react', 'react-dom'], // Mark react and react-dom as external
  plugins: [
    babel({
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
      babelHelpers: 'bundled',
    }),
    postcss(), // Handle CSS imports
    terser(), // Minify the output
  ],
};
