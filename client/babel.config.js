module.exports = {
  presets: [
    '@babel/preset-env', // Handles modern JavaScript syntax
    '@babel/preset-react', // Handles JSX and React-specific syntax
  ],
  plugins: [
    '@babel/plugin-proposal-private-methods', // Enables support for private methods in classes
    '@babel/plugin-proposal-private-property-in-object', // Enables support for private properties in objects
    '@babel/plugin-transform-class-properties', // Transforms class properties (optional, may be covered by preset-env)
    '@babel/plugin-transform-optional-chaining', // Transforms optional chaining (optional, may be covered by preset-env)
    '@babel/plugin-transform-nullish-coalescing-operator', // Transforms nullish coalescing operator (optional, may be covered by preset-env)
    '@babel/plugin-transform-numeric-separator', // Transforms numeric separators (optional, may be covered by preset-env)
  ]
}
