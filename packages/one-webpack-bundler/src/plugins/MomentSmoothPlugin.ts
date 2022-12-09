/**
 * moment 语言包加载优化，默认仅加载中文
 */
import { ContextReplacementPlugin } from 'webpack';

import { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

export class MomentSmoothPlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('MomentSmoothPlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('MomentSmoothPlugin', async (chain) => {
        chain
          .plugin('MomentContextReplacementPlugin')
          .use(ContextReplacementPlugin, [/moment\/locale$/, /zh-cn/]);
      });
    });
  }
}
