module.exports = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-transform-class-properties", // Updated plugin
    "@babel/plugin-transform-private-property-in-object", // Updated plugin
    "@babel/plugin-transform-optional-chaining", // Updated plugin
    "@babel/plugin-transform-nullish-coalescing-operator", // Updated plugin
    "@babel/plugin-transform-private-methods", // Updated plugin
    "@babel/plugin-transform-numeric-separator"
  ]
}
