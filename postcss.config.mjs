import stylex from "@stylexjs/postcss-plugin";

import babelConfig from "./babel.config.js";

export default {
  plugins: [
    stylex({
      include: ["src/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
      babelConfig: {
        babelrc: false,
        presets: ["@babel/preset-typescript"],
        ...babelConfig,
      },
    }),
  ],
};
