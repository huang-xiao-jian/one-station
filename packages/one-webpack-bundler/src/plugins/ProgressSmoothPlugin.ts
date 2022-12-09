import { ProgressPlugin } from 'webpack';

import { WebpackBundler } from '../internal/WebpackBundler';
import { WebpackBundlerPlugin } from '../internal/WebpackBundlerPlugin';

export class ProgressSmoothPlugin implements WebpackBundlerPlugin {
  apply(bundler: WebpackBundler) {
    bundler.hooks.blueprint.tapPromise('ProgressSmoothPlugin', async (wbc, wbi) => {
      wbc.hooks.initialize.tapPromise('ProgressSmoothPlugin', async (chain) => {
        // 环境变量默认为字符串类型
        chain.plugin('ProgressPlugin').use(ProgressPlugin, [{}]);
      });
    });
  }
}
