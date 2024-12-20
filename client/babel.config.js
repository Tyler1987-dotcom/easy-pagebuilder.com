module.exports = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-proposal-private-property-in-object",  // Corrected plugin
    "@babel/plugin-transform-optional-chaining",
    "@babel/plugin-transform-nullish-coalescing-operator",
    '@babel/plugin-proposal-private-methods',
    "@babel/plugin-transform-numeric-separator"
  ]
}
