/* eslint-disable indent */
/* webpack config */
const { resolve, relative, dirname } = require('path');
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
          publicPath: '/',
        },
      }
    : 'style-loader',
  { loader: 'css-loader', options: { importLoaders: 1 } },
  'postcss-loader',
];

const getHash = (num) => `${isProduction() ? 'contenthash' : 'hash'}:${num}`;

module.exports = {
  // config
  entry: ['./src/index.js', './public/index.html'],
  output: {
    filename: `assets/js/[name].[${getHash(5)}].js`,
    path: resolve(__dirname, 'dist'),
    // publicPath: '/',
    chunkFilename: `assets/js/[name].[${getHash(5)}].chunk.js`,
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
          // {
          //   test: /\.js$/,
          //   exclude: /node_modules/,
          //   use: [
          //     {
          //       loader: 'babel-loader',
          //       options: {
          //         presets: [
          //           [
          //             '@babel/preset-env',
          //             {
          //               useBuiltIns: 'usage',
          //               corejs: {
          //                 version: 3,
          //               },
          //               targets: {
          //                 chrome: '60',
          //                 firefox: '60',
          //                 ie: '9',
          //                 safari: '10',
          //                 edge: '17',
          //               },
          //             },
          //           ],
          //         ],
          //       },
          //     },
          //     {
          //       loader: 'eslint-loader',
          //       options: { fix: true },
          //       // enforce: 'pre',
          //     },
          //   ],
          // },
          {
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader',
            options: {
              // base64 treatment if less than 8KB
              limit: 8 * 1024,
              name: `[name].[${getHash(5)}].[ext]`,
              outputPath: 'assets/images',
              esModule: false,
            },
            enforce: 'pre',
          },
          { test: /\.html$/, loader: 'html-loader' },
          {
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            include: resolve(__dirname, 'src/assets/fonts'),
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/fonts/',
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
      {
        exclude: [/(\.(css|js|json|html|s[ac]ss|jpg|png|gif|)$)/, /fonts/],
        loader: 'file-loader',
        options: {
          name: `[name].[${getHash(5)}].[ext]`,
          outputPath: 'assets/media',
        },
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
    // new WorkboxWebpackPlugin.GenerateSW({
    //   // launch service worker
    //   clientsClaim: true,
    //   skipWaiting: true,
    // }),
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
    // 运行代码的目录
    contentBase: resolve(__dirname, 'dist'),
    // 监视 contentBase 目录下的所有文件，一旦文件变化就会 reload
    watchContentBase: true,
    watchOptions: {
      // 忽略文件
      ignored: /node_modules/,
    },
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 域名
    host: 'localhost',
    // 自动打开浏览器
    open: true,
    // 开启HMR功能
    hot: !isProduction(),
    // 不要显示启动服务器日志信息
    // clientLogLevel: 'none',
    // // 除了一些基本启动信息以外，其他内容都不要显示
    // quiet: true,
    // // 如果出错了，不要全屏提示~
    // overlay: false,
    // // 服务器代理 --> 解决开发环境跨域问题
    proxy: {
      // 一旦devServer(5000)服务器接受到 /api/xxx 的请求，就会把请求转发到另外一个服务器(3000)
      '/api': {
        target: 'http://localhost:3000',
        // 发送请求时，请求路径重写：将 /api/xxx --> /xxx （去掉/api）
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  devtool: isProduction() ? 'source-map' : 'eval-source-map',
  resolve: {
    alias: {
      $assets: resolve(__dirname, 'src/assets'),
    },
    extensions: ['.js', '.json', '.jsx'],
    modules: [resolve(__dirname, './node_modules'), 'node_modules'],
  },
};
