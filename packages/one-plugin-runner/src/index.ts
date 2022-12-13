import type { OnePlugin } from '@one/plugin';

/**
 * 仅适用于类型推断
 */
export function createOnePlugin(fn: OnePlugin): OnePlugin {
  return fn;
}
