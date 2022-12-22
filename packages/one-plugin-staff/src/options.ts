import { WebpackBundlerPlugin } from '@one/webpack-bundler';

/**
 * 命令行传参
 */
export interface InlineOptions {
  /**
   * 是否开启 CORS，默认开启
   */
  watch?: boolean;
}

/**
 * 构建参数
 */
export interface ResolvedOptions {
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
  /**
   * 静态文件根目录，暂定单目录模式
   */
  watch: boolean;
  /**
   * 插件声明
   */
  plugins: WebpackBundlerPlugin[];
}
