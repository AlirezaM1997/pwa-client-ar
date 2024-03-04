module.exports = {
  mode: "development",
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "/node_modules/chabokpush/dist/ChabokSDKWorker.js"),
        to: path.resolve(__dirname, "/dist"),
        ignore: [".*"],
      },
    ]),
  ],
  devtool: false,
};
