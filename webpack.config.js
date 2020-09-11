/* webpack config */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAseetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const commonCssLoader = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../',
    },
  },
  { loader: 'css-loader', options: { importLoaders: 1 } },
  'postcss-loader',
];

module.exports = {
  // config
  entry: './src/index.js',
  output: {
    filename: 'assets/js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      // loader
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          // order: right to left
          // 'style-loader',
          ...commonCssLoader,
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3,
                    },
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17',
                    },
                  },
                ],
              ],
            },
          },
          {
            loader: 'eslint-loader',
            options: { fix: true },
            // enforce: 'pre',
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          // base64 treatment if less than 8KB
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          outputPath: './assets/images',
          esModule: false,
        },
        enforce: 'pre',
      },
      { test: /\.html$/, loader: 'html-loader' },
      {
        test: /fonts/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:5].[ext]',
          outputPath: 'assets/fonts/roboto/',
        },
        enforce: 'pre',
      },
      {
        exclude: /(\.(css|js|json|html|s[ac]ss|jpg|png|gif)$)|(fonts)/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:5].[ext]',
          outputPath: 'assets/media',
        },
      },
    ],
  },
  plugins: [
    // plugins config
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:5].css',
    }),
    // new OptimizeCssAseetsWebpackPlugin(),
  ],
  mode: 'development',
  // mode: 'production',

  // dev server
  // command: webpack-dev-server
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    // gzip method
    compress: true,
    port: 3000,
    // automatic open browser
    open: true,
  },
};
