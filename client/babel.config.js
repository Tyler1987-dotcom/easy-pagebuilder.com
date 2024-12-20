module.exports = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-proposal-private-methods", // Corrected plugin
    "@babel/plugin-proposal-private-property-in-object", // Corrected plugin
    "@babel/plugin-transform-class-properties", // Updated plugin (if needed)
    "@babel/plugin-transform-optional-chaining", // Updated plugin (if needed)
    "@babel/plugin-transform-nullish-coalescing-operator", // Updated plugin (if needed)
    "@babel/plugin-transform-numeric-separator" // Updated plugin (if needed)
  ]
}
