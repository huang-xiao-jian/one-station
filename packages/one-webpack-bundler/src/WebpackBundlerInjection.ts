/**
 * 执行上下文访问器，包括文件系统、环境变量
 */
export class WebpackBundlerInjection {
  /**
   * 环境变量访问器
   */
  env<T>(name: string): T {
    return process.env[name] as T;
  }

  /**
   * 外源性配置文件访问器
   */
  cosmic<T = any>(name: string): T {
    throw new Error('TODO NOT FINISHED');
  }
}
