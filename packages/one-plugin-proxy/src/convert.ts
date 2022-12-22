import { flattenDeep, isNil, isString } from 'lodash';

import { FlatProxyRule, ProxyRule } from './options';

/**
 * 扁平化处理
 */
export function toFlatProxyRule(rule?: ProxyRule): FlatProxyRule[] {
  if (isNil(rule)) {
    return [];
  }

  if (isString(rule.context)) {
    return [
      {
        ...rule,
        context: rule.context,
      },
    ];
  }

  return rule.context.map((context) => ({
    ...rule,
    context,
  }));
}

export function toFlatProxyRules(rules?: ProxyRule[]): FlatProxyRule[] {
  if (isNil(rules)) {
    return [];
  }

  return flattenDeep(rules.map((rule) => toFlatProxyRule(rule)));
}
