import { InjectionToken } from 'injection-js';

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
   * 文件访问基准路径
   */
  publicPath: string;
}

export const WebpackBuildOptionsToken = new InjectionToken<WebpackBuildOptions>(
  'WebpackBuildOptions',
);
