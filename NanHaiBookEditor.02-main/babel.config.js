module.exports = {
  presets: [['@babel/preset-env'], '@babel/preset-typescript', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-runtime',
    ['import', {libraryName: 'antd', style: true}, 'antd'],
  ],
};
