const path =                    require("path")
const fs =                      require("fs")
const HtmlWebpackPlugin =       require("html-webpack-plugin")
const webpack =                 require("webpack");
const SVGSpritemapPlugin =      require("svg-spritemap-webpack-plugin");
const CopyPlugin =              require("copy-webpack-plugin");
const VueLoaderPlugin =         require('vue-loader/lib/plugin')

const appFolders = fs.readdirSync(path.resolve(__dirname, "src/apps"));

const htmlPages = appFolders.reduce((acc, appName) => {
    const templates = fs
        .readdirSync(path.resolve(__dirname, "src/apps", appName))
        .filter(fileName => fileName.endsWith(".twig"));
    const pages = templates.map(name => {
        return {
            appName,
            template: name
        }
    })
    return [...acc, ...pages];
}, [])

console.info('Page count:', htmlPages.length);

/** @type {webpack.Configuration} */
module.exports = {
    entry: {
        website: "./src/apps/website/index.js"
    },
    resolve: {
        extensions: [".js", ".scss", ".css"],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            assets: path.resolve(__dirname, 'src/assets'),
            'vue$': 'vue/dist/vue.esm.js' 
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        ...htmlPages.map(page => new HtmlWebpackPlugin({
            template: `src/apps/${page.appName}/${page.template}`,
            filename: page.template.replace(".twig", ".html"),
            chunks: ['styles', page.appName],
            minify: false
        })),
        new SVGSpritemapPlugin("src/assets/icons/**/*.svg", {
            output: {
                filename: "icons/icons.svg",
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            "window.jQuery": "jquery",
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/mocks/master-json-files.json', to: 'mocks' },
                { from: 'src/assets/favicon', to: 'assets/favicon' },
            ]
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV.trim())
        })
    ],
    externals: {
        // jquery: 'jQuery'
    }
}