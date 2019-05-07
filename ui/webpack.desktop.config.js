module.exports = {
  context: __dirname,

  entry: "./src/index.jsx",
  target: 'electron-renderer',

  output: {
    filename: "bundle.js",
    path: __dirname,
  },
  // Existing Code ....
  module : {
    rules: [
      {
        test : /\.jsx?/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          },
          {
            loader: 'webpack-preprocessor-loader',
            options: {
              params: {
                ENV: process.env.NODE_ENV,
                isElectron: true
              },
              verbose: false
            }
          },
        ]
      }
    ]
  }
};
