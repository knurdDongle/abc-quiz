const webpack = require('webpack');
const WebpackChunkHash = require('webpack-chunk-hash');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bootstrapEntryPoints = require('./webpack.bootstrap.config.js');


const path = require('path');

const configDev = {
  app: [
    'react-hot-loader/patch',
    // activate HMR for React
    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    './src/index.jsx',
  ],
  publicPath: '/',
  css: ['style-loader', 'css-loader', 'sass-loader'],
};

const configProd = {
  app: './src/index.jsx',
  vendor: [
    'react',
    'react-dom',
  ],
  publicPath: '/',
  css: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    // use: ['css-loader', 'sass-loader'],
    use: [
      { loader: 'css-loader', options: { sourceMap: true, minimize: true } },
      'resolve-url-loader',
    ],
  }),
};

module.exports = (env) => {
  const isDevelopment = env.development === true;
  const isProduction = env.production === true;
  const fileNamePrefix = isProduction ? '.[chunkhash]' : '';

  const bootstrapConfig = isProduction ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;
  const config = isProduction ? configProd : configDev;

  return {
    entry: {
      app: config.app,
      vendor: configProd.vendor,
      bootstrap: bootstrapConfig,
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      pathinfo: true,
      // filename: '[name].bundle.js',
      filename: `js/[name]${fileNamePrefix}.js`,
      // publicPath: config.publicPath,
    },
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          use: config.css,
        },
        {
          test: /\.jsx?$/,
          enforce: 'pre',
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'src'),
          loader: 'eslint-loader',
          options: {
            emitWarning: true,
          },
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  'syntax-dynamic-import',
                  'transform-class-properties',
                ],
                presets: ['env', 'react'],
              },
            },
          ],
        },
        // {
        //   test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //   use: 'url-loader?limit=10000&name=fonts/[name].[ext]',
        // },
        // {
        //   test: /\.(png|jpg|gif)(\?[\s\S]+)?$/,
        //   use: 'file-loader?name=images/[name].[ext]',
        // },
        // {
        //   test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        //   use: 'file-loader?name=fonts/[name].[ext]',
        // },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[ext]',
          },
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[name].[ext]',
            },
          },
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: {
            loader: 'img-loader',
            options: {
              enabled: process.env.NODE_ENV === 'production',
              gifsicle: {
                interlaced: false,
              },
              mozjpeg: {
                progressive: true,
                arithmetic: false,
              },
              optipng: false, // disabled
              pngquant: {
                floyd: 0.5,
                speed: 2,
              },
              svgo: {
                plugins: [
                  { removeTitle: true },
                  { convertPathData: false },
                ],
              },
            },
          },
        },

        // Use one of these to serve jQuery for Bootstrap scripts:

        // Bootstrap 3
        { test: /bootstrap-sass\/assets\/javascripts\//, use: 'imports-loader?jQuery=jquery' },
      ],
    },
    devServer: {
    //   contentBase: path.join(__dirname, 'dist'),
      compress: true,
      disableHostCheck: true,
      inline: true,
      stats: 'errors-only',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      historyApiFallback: true,
      // show compile errors
      hot: true,
      overlay: true,
    },
    cache: false,
    resolve: {
      modules: [
        path.join(__dirname, 'dist'),
        'node_modules', 'shared',
      ],
      extensions: ['.js', '.jsx', '.json', '*'],
    },
    plugins: (function plugin() {
      const plugins = [];
      plugins.push(
        new HtmlWebpackPlugin({
          template: './src/index.html',
          title: 'Property Listings With Google Maps',
          excludeChunks: ['base'],
          filename: 'index.html',
          minify: {
            collapseWhitespace: true,
            collapseInlinespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
          },
          inject: 'body',
        }),
        new webpack.ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery',
        }),
      );
      if (isDevelopment) {
        plugins.push(
          new webpack.HotModuleReplacementPlugin(),
          // enable HMR globally

          new webpack.NamedModulesPlugin(),
          // prints more readable module names in the browser console on HMR updates

          new webpack.NoEmitOnErrorsPlugin(),
          // do not emit compiled assets that include errors
        );
      }
      if (isProduction) {
        //add some plugins that are only for production here
        plugins.push(
          new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer',
          }),
          new WebpackChunkHash(), //webpack-chunk-hash
          new webpack.HashedModuleIdsPlugin(),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: m => m.context && m.context.includes('node_modules'),
            filename: 'js/vendor/vendor.[chunkhash].js',
            // filename: 'vendor.js',
          }),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime',
            chunks: ['vendor'],
            minChunks: Infinity,
            filename: 'js/runtime/runtime.[chunkhash].js',
            // filename: 'vendor.js',
          }),
          new webpack.optimize.ModuleConcatenationPlugin(),
          new ExtractTextPlugin({
            filename: 'styles/[name].[contenthash].css',
            // filename: '[name].css',
            allChunks: true,
          }),
          new webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: true,
            sourcemap: true,
            compress: {
              warnings: false, // Suppress uglification warnings
              pure_getters: true,
              conditionals: true,
              join_vars: true,
              if_return: true,
              unsafe: true,
              sequences: true,
              booleans: true,
              loops: true,
              unused: false,
              drop_console: true,
              unsafe_comps: true,
              screw_ie8: true,
            },
            output: {
              comments: false,
            },
            exclude: [/\.min\.js$/gi], // skip pre-minified libs
          }),
          // new ExtractTextPlugin({
          //   filename: '[name].css',
          //   allChunks: true,
          // }),
        );
      }
      return plugins;
    }()),
  };
};