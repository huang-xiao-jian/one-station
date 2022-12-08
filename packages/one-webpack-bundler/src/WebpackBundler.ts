import { Injectable } from 'injection-js';
import { AsyncSeriesHook } from 'tapable';
import webpack from 'webpack';

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
    const compiler = webpack(this.wbc.config.toConfig());

    await new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err || stats?.hasErrors()) {
          if (err) {
            reject(err);
          }
          if (stats) {
            reject(stats);
          }
        } else {
          resolve(stats);
        }

        compiler.close(() => {
          // nothing todo
        });
      });
    });
  }
}
