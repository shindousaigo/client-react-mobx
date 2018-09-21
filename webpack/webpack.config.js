const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Autoprefixer = require('autoprefixer');
const path = require('path');

module.exports = (env) => {
  const ifProd = plugin => env.prod ? plugin : undefined;
  const ifDev = plugin => env.dev ? plugin : undefined;
  const removeEmpty = array => array.filter(p => !!p);
  const mode = env.prod ? 'production' : 'development';
  return {
    devtool: ifDev('source-map'),
    mode,
    entry: {
      app: removeEmpty([
        ifDev('react-hot-loader/patch'),
        ifDev(`webpack-hot-middleware/client?http://localhost:${env.port}`), // 
        ifDev('webpack/hot/dev-server'),
        path.join(__dirname, '../src/index.tsx')
      ]),
    },
    resolve: {
      /*
       * An array of extensions that should be used to resolve modules.
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        src: path.resolve(__dirname, '../src/')
      }
    },
    output: {
      filename: '[name].[hash:6].js',
      sourceMapFilename: '[name].[hash:6].map.js',
      path: path.join(__dirname, '../build/'),
      // publicPath: '/', can uncomment if you want everything relative to root '/'
    },
    // optimization: {
    //   minimize: env.prod,
    //   splitChunks: {
    //     chunks: 'all',
    //   }
    // },
    module: {
      rules: [{
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: env.prod ?
            'awesome-typescript-loader?target=es5' : 'awesome-typescript-loader'
        },
        {
          test: /\.(css)$/,
          use: [
            env.dev || env.test ? 'style-loader' : 'style-loader' || MiniCssExtractPlugin.loader,
            'css-loader', //?modules=false&minimize&-autoprefixer',
            'postcss-loader'
          ]
        },
        {
          test: /\.(scss)$/,
          use: [
            env.dev || env.test ? 'style-loader' : 'style-loader' || MiniCssExtractPlugin.loader,
            'css-loader', //?modules=false&minimize&-autoprefixer',
            'postcss-loader',
            'sass-loader',
          ]
        },
        {
          test: /\.(less)$/,
          use: [
            env.dev || env.test ? 'style-loader' : 'style-loader' || MiniCssExtractPlugin.loader,
            'css-loader', //?modules=false&minimize&-autoprefixer',
            'postcss-loader',
            {
              loader: 'less-loader',
              options: {
                inlineJavaScript: true,
                // paths: [
                //   path.resolve(__dirname, 'node_modules')
                // ]
              }
            },
          ]
        },
        // {
        //   test: /\.(png|jpg)$/,
        //   use: 'url-loader?limit=8192'
        // },
        {
          test: /\.(gif|jpg|png|woff|eot|ttf)\??.*$/,
          use: [{
            loader: 'file-loader',
            // options: {
            //   name: '[name]-[hash:4].[ext]',
            //   outputPath: './img'
            // }
          }]
        },
        {
          test: /\.svg$/,
          include: /node_modules/,
          use: ['file-loader'],
        }, {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: ['@svgr/webpack', 'file-loader'],
        }
      ],
    },
    plugins: removeEmpty([
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/index.html'),
        filename: 'index.html',
        inject: 'body',
      }),
      // new webpack.LoaderOptionsPlugin({
      //   minimize: env.prod,
      //   debug: env.dev,
      //   options: {
      //     context: __dirname,
      //     postcss: [Autoprefixer({
      //       browsers: ['last 3 versions']
      //     })],
      //   },
      // }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.ProvidePlugin({
        TweenMax: ['gsap', 'TweenMax'],
        md5: 'md5'
      }),
      new webpack.DefinePlugin({
        __DEVELOPMENT__: Boolean(env.dev),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      // ifProd(new MiniCssExtractPlugin({
      //   filename: '[name].[hash].css',
      // })),
    ]),
  };
};