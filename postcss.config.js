import presetEnv from 'postcss-preset-env';
import postcssNesting from 'postcss-nesting';
import postcssCustomProperties from 'postcss-custom-properties';

export default {
  plugins: [
    postcssNesting(),
    postcssCustomProperties(),
    presetEnv({
      stage: 2, // enables safe modern features
      autoprefixer: true
    })
  ]
};


