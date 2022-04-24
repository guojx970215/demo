const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const clientSrcIndexPath = path.resolve('src/index.tsx');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const tsconfig = require('./tsconfig.json');
const packageJson = require('./package.json');

const distPath = path.resolve('dist');
const distPublicPath = path.resolve(distPath, 'public');

const isDevelopment = process.env.NODE_ENV === 'development';
const isUseWebpackBundleAnalyzer = process.env.WEBPACK_BUNDLE_ANALYZER === 'true';

const getAlias = () => {
  const paths = tsconfig.compilerOptions.paths;
  const validKeys = Object.keys(paths).filter((key) => !/\/\*$/.test(key));
  const alias = validKeys.reduce((aliases, aliasName) => {
    aliases[aliasName] = path.resolve(__dirname, `${paths[aliasName][0]}`);
    return aliases;
  }, {});
  return alias;
};

const commonPlugins = [
  new HtmlWebpackPlugin({
    template: 'public/index.html',
    favicon: 'public/favicon.ico',
  }),
];

module.exports = () => {
  const config = {
    target: 'web',
    entry: clientSrcIndexPath,
    experiments: {
      asset: true,
    },
    output: {
      path: distPublicPath,
      filename: '[name].bundle.js',
      clean: true,
      publicPath: '/',
    },
    plugins: isUseWebpackBundleAnalyzer
      ? [new BundleAnalyzerPlugin(), ...commonPlugins]
      : commonPlugins,
    devtool: isDevelopment ? 'cheap-module-source-map' : 'hidden-source-map',
    devServer: {
      contentBase: './dist',
      publicPath: '/',
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/api': packageJson.proxy,
      },
      clientLogLevel: 'warn',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: getAlias(),
    },
    mode: isDevelopment ? 'development' : 'production',
    module: {
      rules: [
        {
          test: /\.ico$/i,
          type: 'asset/source',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.less$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  modifyVars: {
                    'primary-color': '#3290fc',
                  },
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [!isDevelopment && new TerserPlugin()].filter(Boolean),
      splitChunks: {
        chunks: 'all',
      },
    },
  };

  return config;
};
