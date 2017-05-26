const webpack = require('webpack');
module.exports = {
	entry:'./index.jsx',
	output:{
		filename:'./public/javascripts/[name].js'
	},
	module:{
		loaders:[{
			test:/\.jsx$/,
			loaders:['jsx-loader','babel-loader?presets[]=react,presets[]=es2015'],
			exclude:/node_modules/
		}]
	}
}