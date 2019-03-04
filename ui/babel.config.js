const presets = [
    [
      "@babel/env",
      {
        targets: {
          chrome: "72",
        },
        useBuiltIns: false, //"usage",
      },
    ],
  ];

  const plugins = [ ["@babel/plugin-transform-react-jsx", { "pragma":"h" }], ["@babel/plugin-proposal-class-properties"]]
  
  module.exports = { presets, plugins };