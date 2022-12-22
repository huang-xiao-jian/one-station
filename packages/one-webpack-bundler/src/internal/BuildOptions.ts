import { InjectionToken } from 'injection-js';

import { WebpackBundlerPlugin } from './WebpackBundlerPlugin';

export interface WebpackBuildOptions {
  /**
   * 构建项目根目录，主要体现在 monorepo 项目差异
   */
  root: string;
  /**
   * 命令执行目录，主要体现在 monorepo 项目差异
   */
  cwd: string;
  /**
   * 是否持续构建模式
   */
  watch?: boolean;
  /**
   * 文件访问基准路径
   */
  publicPath: string;
  /**
   * 允许外部传入非预设插件，调整内部功能实现
   */
  plugins?: WebpackBundlerPlugin[];
}

export const WebpackBuildOptionsToken = new InjectionToken<WebpackBuildOptions>(
  'WebpackBuildOptions',
);
