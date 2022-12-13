import type { Command } from 'commander';

export interface ICommandHooks {
  /**
   * 引用依赖环境变量，支持链式调用
   */
  referenceEnvironmentVariable: (names: string | string[]) => ICommandHooks;
  /**
   * 引用配置文件内容
   */
  referenceConfig: (names: string | string[]) => ICommandHooks;
  /**
   * 注册命令行可变参数，支持链式调用
   */
  defineBehavior: (behavior: ICommandBehavior) => ICommandHooks;
  /**
   * 注册命令实际执行
   */
  defineAction: (action: ICommandAction) => void;
}

export interface ICommandDescriptor {
  /**
   * 子命令名称
   */
  name: string;
  /**
   * 子命令功能描述
   */
  description: string;
}

/**
 * 注册子命令入参
 */
export type ICommandBehavior = (command: Command) => void;

/**
 * 命令行功能执行
 */
export type ICommandAction = (command: Command) => any;
