module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  overrides: [
    {
      files: '.prettierrc',
      options: { parser: 'json' },
    },
  ],
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
  importOrder: ['reflect-metadata', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
};
