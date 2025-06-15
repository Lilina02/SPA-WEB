import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(process.cwd(), "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"], // GANTI: dari style-loader
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "styles/main.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/manifest.webmanifest", to: "" },
        { from: "public/service-worker.js", to: "" },
        { from: "public/icons", to: "icons" },
      ],
    }),
  ],

  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.resolve(process.cwd(), "dist"),
    },
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      "/v1": {
        target: "https://story-api.dicoding.dev",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  resolve: {
    extensions: [".js"],
  },
};
