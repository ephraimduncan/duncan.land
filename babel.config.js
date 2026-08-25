import process from "node:process";

const dev = process.env.NODE_ENV !== "production";

export default {
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        dev,
        unstable_moduleResolution: { type: "commonJS" },
      },
    ],
  ],
};
