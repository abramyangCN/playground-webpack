/* eslint-disable indent */
/* webpack config */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAseetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const isProduction = () => process.env.NODE_ENV === 'production';

const commonCssLoader = [
  isProduction()
    ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../../',
        },
      }
    : 'style-loader',
  { loader: 'css-loader', options: { importLoaders: 1 } },
  'postcss-loader',
];

const getHash = (num) => `${isProduction() ? 'contenthash' : 'hash'}:${num}`;

module.exports = {
  // config
  entry: './src/index.js',
  output: {
    filename: `assets/js/[name].[${getHash(5)}].js`,
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        oneOf: [
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
              // {
              //   loader: 'thread-loader',
              //   options: {
              //     workers: 2,
              //   },
              // },
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
                  cacheDirectory: true,
                },
              },
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
              name: `[${getHash(5)}].[ext]`,
              outputPath: 'assets/images',
              esModule: false,
            },
            enforce: 'pre',
          },
          { test: /\.html$/, loader: 'html-loader' },
          {
            test: /fonts/,
            loader: 'file-loader',
            options: {
              name(file) {
                return file.split('fonts')[1];
              },
              outputPath: 'assets/fonts/',
            },
            enforce: 'pre',
          },
          {
            exclude: [/(\.(css|js|json|html|s[ac]ss|jpg|png|gif)$)/, /fonts/],
            loader: 'file-loader',
            options: {
              name: `[name].[[${getHash(5)}]].[ext]`,
              outputPath: 'assets/media',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: { fix: true },
      },
    ],
  },
  plugins: [
    // plugins config
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new MiniCssExtractPlugin({
      filename: `./assets/css/[name].[${getHash(5)}].css`,
    }),
    // new OptimizeCssAseetsWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      // launch service worker
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  mode: 'development',
  // mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  // dev server
  // command: webpack-dev-server
  externals: {
    jquery: 'jQuery',
  },
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    // gzip method
    compress: true,
    port: 3000,
    // automatic open browser
    open: true,
    hot: !(process.env.NODE_ENV === 'production'),
  },
  devtool:
    process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
};
