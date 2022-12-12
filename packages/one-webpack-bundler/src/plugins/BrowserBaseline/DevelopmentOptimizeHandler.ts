import WebpackChain from 'webpack-chain';

import { WebpackBundlerInjection } from '../../internal/WebpackBundlerInjection';

/**
 * 开发模式关闭压缩即可
 */
export class BrowserBaselineDevelopmentOptimizeHandler {
  handle(chain: WebpackChain, injection: WebpackBundlerInjection) {
    chain.optimization.minimize(false);
  }
}
