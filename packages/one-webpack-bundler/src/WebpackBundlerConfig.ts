import { AsyncSeriesHook } from 'tapable';
import WebpackChain from 'webpack-chain';

export interface WebpackBundlerConfigHooks {
  initialize: AsyncSeriesHook<WebpackChain>;
  aggregation: AsyncSeriesHook<WebpackChain>;
  enhancement: AsyncSeriesHook<WebpackChain>;
}

export class WebpackBundlerConfig {
  /**
   * 配置插件化核心
   */
  readonly hooks: WebpackBundlerConfigHooks = {
    initialize: new AsyncSeriesHook(['webpack initialize']),
    aggregation: new AsyncSeriesHook(['webpack aggregation']),
    enhancement: new AsyncSeriesHook(['webpack enhancement']),
  };

  /**
   * 配置存储容器
   */
  readonly config: WebpackChain = new WebpackChain();
}
