import { Injectable } from 'injection-js';
import { AsyncSeriesHook } from 'tapable';
import WebpackChain from 'webpack-chain';

export interface WebpackBundlerConfigHooks {
  // 内建构建配置，优先级最低
  initialize: AsyncSeriesHook<WebpackChain>;
  // 内置配置微调，优先级次之
  adjustment: AsyncSeriesHook<WebpackChain>;
  // 配置对象增强，例如考虑后续 MFSU 引入，优先级最高，调用顺序最后
  enhancement: AsyncSeriesHook<WebpackChain>;
}

@Injectable()
export class WebpackBundlerConfig {
  /**
   * 配置插件化核心
   */
  readonly hooks: WebpackBundlerConfigHooks = {
    initialize: new AsyncSeriesHook(['chain']),
    adjustment: new AsyncSeriesHook(['chain']),
    enhancement: new AsyncSeriesHook(['chain']),
  };

  /**
   * 配置存储容器
   */
  readonly config: WebpackChain = new WebpackChain();
}
