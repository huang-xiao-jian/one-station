import { OnePlugin } from '@one/plugin';
import { createOnePlugin } from '@one/plugin-runner';
import { RequestHandler, createProxyMiddleware } from 'http-proxy-middleware';
import { fromPairs, map } from 'lodash';

import { toFlatProxyRules } from './convert';
import { ProxyOptions } from './options';
import { ProxySchema } from './schema';

declare global {
  interface OneHandlerMapping {
    // TODO - 支持自定义参数
    'proxy:middleware': () => Promise<RequestHandler[]>;
  }
}

const OneProxyPlugin: OnePlugin = createOnePlugin((api) => {
  /**
   * 注册参数
   */
  api.registerConfig({
    key: 'proxy',
    schema: ProxySchema,
  });
  /**
   * 注册共享职能函数
   */
  api.registerHandler('proxy:middleware', async () => {
    const proxy: ProxyOptions = api.consumeConfig('proxy');
    const units: RequestHandler[] = [];
    const rules = toFlatProxyRules(proxy.rules);
    rules.forEach((rule) => {
      units.push(
        createProxyMiddleware(rule.context, {
          target: rule.target,
          changeOrigin: rule.changeOrigin,
          pathRewrite: fromPairs(map(rule.rewrites, (rewrite) => [rewrite.from, rewrite.to])),
        }),
      );
    });
    return units;
  });
});

export default OneProxyPlugin;
