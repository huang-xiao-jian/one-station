import { Injectable } from 'injection-js';
import { AsyncSeriesHook } from 'tapable';
import WebpackChain from 'webpack-chain';

export interface WebpackBundlerConfigHooks {
  initialize: AsyncSeriesHook<WebpackChain>;
  aggregation: AsyncSeriesHook<WebpackChain>;
  enhancement: AsyncSeriesHook<WebpackChain>;
}

@Injectable()
export class WebpackBundlerConfig {
  /**
   * 配置插件化核心
   */
  readonly hooks: WebpackBundlerConfigHooks = {
    initialize: new AsyncSeriesHook(['chain']),
    aggregation: new AsyncSeriesHook(['chain']),
    enhancement: new AsyncSeriesHook(['chain']),
  };

  /**
   * 配置存储容器
   */
  readonly config: WebpackChain = new WebpackChain();
}
