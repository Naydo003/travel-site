
const currentTask = process.env.npm_lifecycle_event       // Will be either dev or build
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')     // Allows the css the be extracted into a separate .css file
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')    // Converts above file into compressed min format
const HtmlWebpackPlugin = require('html-webpack-plugin')           // Gets filenames to .css and .js files and creates links in .html to them. Required as filenames keep changing due to chunkhash
const fse = require('fs-extra')                           // node file system allows for multiple html pages. Note this setup ok for <10 html pages. Greater than 10 need static site generator

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
  ]

// This copies all the images over
class RunAfterCompile {
  apply(compiler){
    compiler.hooks.done.tap('copy images', function(){
      fse.copySync('./app/assets/images', './docs/assets/images')
    })
  }
}

let cssRules = {
    test: /\.css$/i,
    use: ["css-loader", { loader: "postcss-loader", options: { postcssOptions: { plugins: postCSSPlugins } } }]
  }

let pages = fse.readdirSync('./app').filter(function(file){
  return file.endsWith('.html')
}).map(function(page){
  return new HtmlWebpackPlugin({
    filename: page, 
    template: `./app/${page}`
  })
})

let config = {
    entry: './app/assets/scripts/App.js',
    plugins: pages,            // each html page needs a new HtmlWebpackPlugin
    module: {
      rules: [cssRules]
    }
}

  if (currentTask == 'dev') {
    config.mode = 'development'

    cssRules.use.unshift('style-loader')
    config.output = {
      filename: 'bundled.js',
      path: path.resolve(__dirname, 'app')
    }

    config.devServer = {
      // onBeforeSetupMiddleware: function(app, server) {
      //   server._watch('./app/**/*.html')
      // },
      static: {
        directory: path.join(__dirname, 'app')
      },
      hot: true,
      port: 8080,
      host: '0.0.0.0'
    }

  }

  if (currentTask == 'build') {

    config.module.rules.push({             // need npm install @babel/core @babel/preset-env babel-loader --save-dev
      test: /\.js$/,                       // All this junk creates a bundle that can be run in older browsers
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }

    )

    config.mode = 'production'

    cssRules.use.unshift(MiniCssExtractPlugin.loader)

    config.output = {
      filename: '[name].[chunkhash].js',             // adding chunhash allows browser to see file is modified. If a change in code a new hash will be generated.
      chunkFilename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'docs')          // Folder name dist (for distribution) is common but had to change it to docs for Github
    }

    config.optimization = {                   // splitChunks separates node packes etc into vendor-file.js in dist. Less downloading for client.
      splitChunks: {chunks: 'all'},
      minimize: true,
      minimizer: ['...', new CssMinimizerPlugin()]     
    }
    config.plugins.push( 
      new CleanWebpackPlugin(), 
      new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
      new RunAfterCompile()
    )
  }


module.exports = config