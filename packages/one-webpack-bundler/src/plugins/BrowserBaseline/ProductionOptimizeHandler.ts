import type { JsMinifyOptions as SwcMinifyOptions } from '@swc/core';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import WebpackChain from 'webpack-chain';

import { WebpackBundlerInjection } from '../../internal/WebpackBundlerInjection';

export class BrowserBaselineProductionOptimizeHandler {
  handle(chain: WebpackChain, injection: WebpackBundlerInjection) {
    const disabled = injection.env<Maybe<string>>('DISABLE_MINIMIZE');

    chain.optimization.minimize(true);
    chain.optimization.minimizer('swc-js').use(TerserPlugin<SwcMinifyOptions>, [
      {
        minify: TerserPlugin.swcMinify,
        // `terserOptions` options will be passed to `swc` (`@swc/core`)
        // Link to options - https://swc.rs/docs/config-js-minify
        terserOptions: {},
      },
    ]);
    chain.optimization.minimizer('swc-css').use(CssMinimizerPlugin, [
      {
        minify: CssMinimizerPlugin.lightningCssMinify,
        /**
         * TODO - 并发构建，影响 lightingcss 加载，后续进行修复
         */
        parallel: false,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      },
    ]);
  }
}
