import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js', // Your entry file
  output: {
    file: 'build/bundle.js', // Output bundle file
    format: 'iife', // Immediately Invoked Function Expression (suitable for browsers)
    name: 'App', // Global variable name for the app in the browser
    sourcemap: true, // Include source maps for debugging
  },
  plugins: [
    resolve({
      browser: true, // Resolve browser-specific modules
    }),
    babel({
      presets: [
        '@babel/preset-env',
        '@babel/preset-react', // Ensure JSX is transpiled
      ],
      babelHelpers: 'bundled', // Use bundled Babel helpers (recommended for Rollup)
      exclude: 'node_modules/**', // Exclude node_modules from Babel transpilation
      extensions: ['.js', '.jsx'], // Handle both JS and JSX files
    }),
    commonjs({
      include: /node_modules/, // Ensure that CommonJS handles node_modules
    }),
    postcss({
      extract: true, // Extract CSS to a separate file
      minimize: true, // Minimize CSS for production
      sourceMap: true, // Enable source maps for CSS
    }),
    terser(), // Minify the JavaScript code for production
  ],
};
