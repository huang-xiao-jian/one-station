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
  readonly plugins: WebpackBundlerPlugin[] = [];

  constructor(
    private readonly wbc: WebpackBundlerConfig,
    private readonly wbi: WebpackBundlerInjection,
  ) {}

  /**
   * 插件体系调度
   */
  async warmUp(plugins: WebpackBundlerPlugin[]) {
    // 插件声明
    plugins.forEach((plugin) => plugin.apply(this));
    // 插件体系 blueprint 环节注册
    await this.hooks.blueprint.promise(this.wbc, this.wbi);
    // config 插件关联插件调用
    await this.wbc.hooks.initialize.promise(this.wbc.config);
  }

  /**
   * 构建应用
   */
  async bundle() {
    const config = this.wbc.config.toConfig();
    const compiler = webpack(config);

    console.log(JSON.stringify(config.module?.rules, null, 2));

    debugger;

    return;

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
