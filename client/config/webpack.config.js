const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');  // Import webpack to use DefinePlugin

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),  // Adjusted to point to src from config folder
  output: {
    path: path.resolve(__dirname, 'build'),  // Build output folder at the root level
    filename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],  // Ensure .jsx files are resolved
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,  // Handle both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
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
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),  // Adjusted to point to public from config folder
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY': JSON.stringify(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY),
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL),
    }),
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
};
