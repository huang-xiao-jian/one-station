import assert from 'assert';
import { cosmiconfig } from 'cosmiconfig';
import { Inject, Injectable } from 'injection-js';

import { WebpackBuildOptionsToken } from './BuildOptions';
import type { WebpackBuildOptions } from './BuildOptions';

type AvailableConfigFile = 'less';

/**
 * 执行上下文访问器，包括文件系统、环境变量
 */
@Injectable()
export class WebpackBundlerInjection {
  constructor(@Inject(WebpackBuildOptionsToken) private readonly options: WebpackBuildOptions) {}

  /**
   * 环境变量访问器
   */
  env<T>(name: string): T {
    return process.env[name] as T;
  }

  config<T>(name: keyof WebpackBuildOptions): T {
    return this.options[name] as T;
  }

  /**
   * 外源性配置文件访问器，文件暂定为强制，方便实现
   */
  async configFile<T = any>(name: AvailableConfigFile): Promise<T> {
    if (name === 'less') {
      const explorer = cosmiconfig('less', {
        stopDir: this.options.root,
        searchPlaces: [`package.json`, `.lessrc`, `.lessrc.yml`, `.lessrc.json`],
      });

      const discovery = await explorer.search(this.options.cwd);
      assert.ok(discovery, '[ConfigFileProvider] less config file required');

      const configResult = await explorer.load(discovery.filepath);
      const configuration = configResult?.config;

      assert.ok(configuration, `[ConfigFileProvider] less config file required`);

      return configuration;
    }

    throw new Error(`[WebpackBundlerInjection] none-supported config file type`);
  }
}
