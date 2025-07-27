module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // From postcss.config.mjs
    'postcss-preset-mantine': {}, // From postcss.config.cjs
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};