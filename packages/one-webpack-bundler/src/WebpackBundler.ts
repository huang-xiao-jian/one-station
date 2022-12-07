import { ICommandInjection } from '@one/plugin';
import { AsyncSeriesHook } from 'tapable';
import { WebpackBundlerConfig } from './WebpackBundlerConfig';
import { WebpackBundlerService } from './WebpackBundlerService';

export interface WebpackBundlerHooks {
  /**
   * 实例化 webpack 构建配置
   */
  blueprint: AsyncSeriesHook<[WebpackBundlerConfig, WebpackBundlerService]>;
}

export interface WebpackBundlerOptions {
  /**
   * 集中访问环境依赖
   */
  injection: ICommandInjection;
}

export class WebpackBundler {
  /**
   * 配置插件化核心
   */
  readonly hooks: WebpackBundlerHooks = {
    blueprint: new AsyncSeriesHook(['webpack bundler config', 'webpack bundler service']),
  };

  constructor(public readonly options: WebpackBundlerOptions) {}
}
