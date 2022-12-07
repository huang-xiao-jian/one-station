import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import type { JsMinifyOptions as SwcMinifyOptions } from '@swc/core';
import WebpackChain from 'webpack-chain';
import { WebpackBundlerInjection } from '../../WebpackBundlerInjection';

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
