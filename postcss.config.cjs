const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const tailwindNesting = require("tailwindcss/nesting");
const cssnano = require("cssnano");

const config = {
  plugins: [
    //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    tailwindNesting,
    tailwindcss(),
    //But others, like autoprefixer, need to run after,
    autoprefixer,
    ...(process.env.NODE_ENV === "production" ? [cssnano] : [cssnano])
  ],
};

module.exports = config;
