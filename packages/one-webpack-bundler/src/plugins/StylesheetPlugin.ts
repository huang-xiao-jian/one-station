/**
 * 静态资源处理
 */

import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

import { WebpackBundler } from '../WebpackBundler';
import { WebpackBundlerPlugin } from '../WebpackBundlerPlugin';

export class StylesheetPlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('StylesheetPlugin', async (wbc, wbs) => {
      wbc.hooks.initialize.tapPromise('StylesheetPluginInitialize', async (chain) => {
        chain.plugin('mini-css-extract-plugin').use(MiniCSSExtractPlugin, [
          {
            filename: 'static/[contenthash].css',
            chunkFilename: 'static/[contenthash].css',
            ignoreOrder: true,
          },
        ]);
      });
    });
  }
}
