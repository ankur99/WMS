/* eslint-disable @typescript-eslint/no-var-requires */
const CracoLessPlugin = require("craco-less");
require("dotenv/config");

// eslint-disable-next-line no-undef
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1890FF" },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
};
