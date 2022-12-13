import { ICommandDescriptor, ICommandHooks, IReferenceInjection } from './command.interface';
import {
  IConfigDescriptor,
  ICosmiConfigDescriptor,
  IEnvironmentVariableDescriptor,
} from './config.interface';

export interface OneHandlerMapping {}

export interface OnePluginApi {
  /**
   * 核心功能导出
   */
  injection: IReferenceInjection;
  /**
   * 导出功能函数，函数必须为异步函数
   */
  registerHandler: (name: string, handler: (...args: any[]) => Promise<any>) => void;
  /**
   * TODO - 消费内部注册服务
   */
  consumeHandler: <N extends keyof OneHandlerMapping>(
    name: N,
    args: Parameters<OneHandlerMapping[N]>,
  ) => ReturnType<OneHandlerMapping[N]>;
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
