import {
  ICommandAction,
  ICommandBehavior,
  ICommandDescriptor,
  ICommandEnvironmentDescriptor,
} from './command.interface';

export interface IOneCommandHooks {
  /**
   * 注册命令行依赖环境变量，需要支持子命令隔离，支持链式调用
   */
  defineEnvironment: (environment: ICommandEnvironmentDescriptor) => IOneCommandHooks;
  /**
   * 注册命令行可变参数，支持链式调用
   */
  defineBehavior: (behavior: ICommandBehavior) => IOneCommandHooks;
  /**
   * 注册命令实际执行
   */
  defineAction: (action: ICommandAction) => void;
}

export interface IOneCommandPluginRegistry {
  /**
   * 被动模式注册命令行
   */
  registerCommand: (cmd: ICommandDescriptor) => IOneCommandHooks;
}
