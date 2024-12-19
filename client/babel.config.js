module.exports = {
  presets: [
    '@babel/preset-env', // Ensures compatibility with modern JavaScript features
    '@babel/preset-react', // For React JSX syntax
  ],
  plugins: [
    '@babel/plugin-proposal-private-methods', // Allows usage of private methods
    '@babel/plugin-proposal-private-property-in-object', // Allows private properties in objects
    '@babel/plugin-transform-runtime', // Optimizes helpers for better performance
  ],
};
