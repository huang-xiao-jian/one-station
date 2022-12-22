/**
 * 命令行传参
 */
export interface InlineSimulateOptions {
  /**
   * 是否开启 CORS，默认开启
   */
  cors: boolean;
  /**
   * 是否开启反向代理，默认开启
   */
  proxy: boolean;
  /**
   * 是否开启接口模拟，暂时默认不开启
   */
  mock: boolean;
  /**
   * 预览服务器端口
   */
  port?: number;
  /**
   * 是否激活浏览器 History 路由模式
   */
  historyApiFallback: boolean;
}

/**
 * 适配需要路径重写，例如租户路径重定向，方便测试
 *
 * @link - https://www.npmjs.com/package/express-urlrewrite
 */
export interface URLRewriteRule {
  from: string;
  to: string;
}

/**
 * 预览服务器选项
 */
export interface SimulateOptions extends Omit<InlineSimulateOptions, 'port'> {
  /**
   * 静态文件根目录，暂定单目录模式
   */
  rootDir: string;
  /**
   * 预览服务器监听模式，默认 http 模式
   */
  protocol: string;
  /**
   * 预览服务器监听域名
   */
  host: string;
  /**
   * 确定性预览服务器端口
   */
  port: number;
  /**
   * 是否激活浏览器 History 路由模式
   */
  historyApiFallback: boolean;
  /**
   * 路径重写规则
   */
  rewriteRules: URLRewriteRule[];
}
