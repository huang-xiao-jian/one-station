import { Injectable } from 'injection-js';
import { AsyncSeriesHook } from 'tapable';
import webpack, { Stats } from 'webpack';

import { WebpackBundlerConfig } from './WebpackBundlerConfig';
import { WebpackBundlerInjection } from './WebpackBundlerInjection';
import { WebpackBundlerPlugin } from './WebpackBundlerPlugin';

export interface WebpackBundlerHooks {
  /**
   * 实例化 webpack 构建配置
   */
  blueprint: AsyncSeriesHook<[WebpackBundlerConfig, WebpackBundlerInjection]>;
}

@Injectable()
export class WebpackBundler {
  /**
   * 配置插件化核心
   */
  readonly hooks: WebpackBundlerHooks = {
    blueprint: new AsyncSeriesHook(['webpackBundlerConfig', 'webpackBundlerInjection']),
  };

  /**
   * 插件集合，外部传入，内部仅负责插件调度
   */
  private readonly plugins: WebpackBundlerPlugin[] = [];

  constructor(
    private readonly wbc: WebpackBundlerConfig,
    private readonly wbi: WebpackBundlerInjection,
  ) {}

  /**
   * 插件聚合
   */
  provide(plugins: WebpackBundlerPlugin[]) {
    this.plugins.push(...plugins);
  }

  /**
   * 插件体系调度
   */
  async warmUp() {
    // 插件执行
    this.plugins.forEach((plugin) => plugin.apply(this));
    // 插件体系 blueprint 环节注册
    await this.hooks.blueprint.promise(this.wbc, this.wbi);
    // config 插件关联插件调用
    await this.wbc.hooks.initialize.promise(this.wbc.config);
  }

  /**
   * 临时逃生窗口，
   * 配置高度依赖插件体系设计，无法满足抽离配置需求
   */
  async toConfig() {
    return this.wbc.config.toConfig();
  }

  /**
   * 构建应用
   */
  async bundle() {
    const config = await this.toConfig();
    const compiler = webpack(config);

    const stats = await new Promise<Maybe<Stats>>((resolve, reject) => {
      compiler.run((err, stats) => {
        /**
         * 实例化阶段错误抛出，webpack 自身不抛出错误单独处理
         */
        if (err) {
          reject(err);
        } else {
          resolve(stats);
        }

        compiler.close(() => {
          // nothing todo
        });
      });
    });

    return stats;
  }
}
