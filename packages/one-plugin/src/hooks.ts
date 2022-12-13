import { ICommandDescriptor, ICommandHooks } from './command.interface';
import {
  IConfigDescriptor,
  ICosmiConfigDescriptor,
  IEnvironmentVariableDescriptor,
} from './config.interface';

/**
 * 内建指令集中声明
 */
declare global {
  interface OneHandlerMapping {
    /**
     * 读取环境变量
     */
    'env:read': <R extends string>(name: string) => R;
    /**
     * 读取文件配置内容
     */
    'config:read': (name: string) => any;
    /**
     * 读取外源配置文件内容
     */
    'cosmic:read': (name: string) => any;
  }
}

export interface OnePluginApi {
  /**
   * 导出功能函数，函数必须为异步函数
   */
  registerHandler: <N extends keyof OneHandlerMapping>(
    name: N,
    handler: OneHandlerMapping[N],
  ) => void;
  /**
   * TODO - 消费内部注册服务
   */
  consumeHandler: <N extends keyof OneHandlerMapping, R = ReturnType<OneHandlerMapping[N]>>(
    name: N,
    args: Parameters<OneHandlerMapping[N]>,
  ) => R;
  /**
   * 被动模式注册命令行
   */
  registerCommand: (cmd: ICommandDescriptor) => ICommandHooks;
  /**
   * 注册统一配置文件属性
   */
  registerConfig: (config: IConfigDescriptor) => void;
  /**
   * 注册 cosmic 风格配置依赖
   */
  registerCosmiConfig: (config: ICosmiConfigDescriptor) => void;
  /**
   * 注册环境变量声明
   */
  registerEnvironmentVariable: (environment: IEnvironmentVariableDescriptor) => void;
}

export type OnePlugin = (api: OnePluginApi) => any;
