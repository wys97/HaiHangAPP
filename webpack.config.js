const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        home: __dirname + "/src/index.js",
        login: __dirname + "/src/login.js",
        rateCalc: __dirname + "/src/rateCalc.js",
        amountDetail: __dirname + "/src/amountDetail.js",
        creditInformation: __dirname + "/src/creditInformation.js",
        hnaIous: __dirname + "/src/hnaIous.js",
        addBankCard: __dirname + "/src/addBankCard.js",
        supportBank: __dirname + "/src/supportBank.js",
        contactsList: __dirname + "/src/contactsList.js",
        contactsAdd: __dirname + "/src/contactsAdd.js",
        contactsAdds: __dirname + "/src/contactsAdds.js",
        creditResult: __dirname + "/src/creditResult.js",
        addBankCardAuth: __dirname + "/src/addBankCardAuth.js",
        idcardDiscern: __dirname + "/src/idcardDiscern.js",
        userInfo: __dirname + "/src/userInfo.js",
        addBankPhone: __dirname + "/src/addBankPhone.js",
        idcardDiscern: __dirname + "/src/idcardDiscern.js",
        faceRecognition: __dirname + "/src/faceRecognition.js",
        myPoint: __dirname + "/src/myPoint.js",
        myPointList: __dirname + "/src/myPointList.js",
        setPassword: __dirname + "/src/setPassword.js",
        whiteStrip: __dirname + "/src/whiteStrip.js",
        invite: __dirname + "/src/invite.js",
        coupon: __dirname + "/src/coupon.js",
        creditFailure: __dirname + "/src/creditFailure.js",
        aboutUs: __dirname + "/src/aboutUs.js",
        airTicket: __dirname + "/src/airTicket.js",
        assessment: __dirname + "/src/assessment.js",
        forgetPassword: __dirname + "/src/forgetPassword.js",
        helpCenter: __dirname + "/src/helpCenter.js",
        securitySet: __dirname + "/src/securitySet.js",
        updata: __dirname + "/src/updata.js",
        changePassword: __dirname + "/src/changePassword.js",
        creditSuccess: __dirname + "/src/creditSuccess.js",
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // equal to __diname + '/build'
        filename: 'build/[name].bundle.js',
        chunkFilename: 'build/[id].chunk.js'
    },
    resolve: {
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['*', '.js', '.json', '.less', '.jsx'],
        /*!//模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            '@components': path.resolve(__dirname,'src/js/components')
        }*/
    },
    devServer: {
        hot: true,
        inline: true, // hot load
        port: 3000,   // dev server listen port
        contentBase: path.join(__dirname, './src'),
        historyApiFallback: true,
        host: '0.0.0.0',
        proxy: {
            '/app-api': {
                target: 'http://10.188.0.46:8080',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015', 'env', 'babel-preset-stage-0']
                }
            },
            {
                test: /\.(css|scss|sass)$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     title: "myapp for test"
        // })
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'build/vendor.bundle.js'
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }), // there are promblem working with webpack v3
        new CopyWebpackPlugin([
            {
                from: __dirname + '/src' // copy all the files except js
            }
        ], {
            ignore: [
                '*.json',
                '*.js',
                '*.scss',
                '*.babelrc',
                '*.jsx',
                '*.png'

                // Doesn't copy any file, even if they start with a dot
                // '**/*'
            ]
        })
    ]
};
