import { ICommandAction, ICommandBehavior, ICommandDescriptor } from './command.interface';

export interface ICommandHooks {
  /**
   * 引用依赖环境变量，支持链式调用
   */
  referenceEnvironment: (name: string) => ICommandHooks;
  /**
   * 注册命令行可变参数，支持链式调用
   */
  defineBehavior: (behavior: ICommandBehavior) => ICommandHooks;
  /**
   * 注册命令实际执行
   */
  defineAction: (action: ICommandAction) => void;
}

export interface ICommandPluginRegistry {
  /**
   * 被动模式注册命令行
   */
  registerCommand: (cmd: ICommandDescriptor) => ICommandHooks;
}
