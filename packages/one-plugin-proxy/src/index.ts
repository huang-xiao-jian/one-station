import { OnePlugin } from '@one/plugin';
import { createOnePlugin } from '@one/plugin-runner';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fromPairs, map } from 'lodash';

import { toFlatProxyRules } from './convert';
import { MiddlewareUnit, ProxyOptions } from './options';
import { ProxySchema } from './schema';

declare global {
  interface OneHandlerMapping {
    // TODO - 支持自定义参数
    'proxy:middleware': () => Promise<MiddlewareUnit[]>;
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
    const units: MiddlewareUnit[] = [];
    const rules = toFlatProxyRules(proxy.rules);
    rules.forEach((rule) => {
      units.push([
        rule.context,
        createProxyMiddleware({
          target: rule.target,
          changeOrigin: rule.changeOrigin,
          pathRewrite: fromPairs(map(rule.rewrites, (rewrite) => [rewrite.from, rewrite.to])),
        }),
      ]);
    });
    return units;
  });
});

export default OneProxyPlugin;
