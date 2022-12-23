import { RequestHandler } from 'http-proxy-middleware';

/**
 * 反向代理路径重写
 *
 * @link - https://github.com/chimurai/http-proxy-middleware
 */
export interface ProxyRewriteRule {
  from: string;
  to: string;
}

/**
 * 反向代理配置
 *
 * @link - https://github.com/chimurai/http-proxy-middleware
 */
export interface ProxyRule {
  /**
   * 一般用于路径前缀匹配
   */
  context: string | string[];
  /**
   * 代理目标
   */
  target: string;
  /**
   * 微调 Header 参数
   */
  changeOrigin: boolean;
  /**
   * 路径重写规则
   */
  rewrites: ProxyRewriteRule[];
}

export interface FlatProxyRule extends Omit<ProxyRule, 'context'> {
  context: string;
}

export interface ProxyOptions {
  /**
   * 反向代理规则集合
   */
  rules?: ProxyRule[];
}
