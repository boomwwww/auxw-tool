export default {
  '**/src/**/*.{html,css,scss,json,js,ts,jsx,tsx,vue,md}': ['cspell lint'],
  '**/src/*.{json,js,ts,jsx,tsx,vue}': ['prettier --write', 'eslint']
}
