module.exports = {
  presets: [
    '@babel/preset-env',  // For modern JavaScript features
    '@babel/preset-react', // For JSX and React-specific features
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-private-property-in-object',
    '@babel/plugin-transform-runtime',
  ],
};
