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
 * 命令行依赖外部数据注入
 */
export interface IReferenceInjection {
  /**
   * 读取环境变量
   */
  env: <T = string>(name: string) => T;
  /**
   * 读取文件配置内容
   */
  config: <T = any>(name: string) => T;
  /**
   * 读取外源配置文件内容
   */
  cosmic: <T = any>(name: string) => T;
}

/**
 * 注册子命令入参
 */
export type ICommandBehavior = (command: Command) => void;

/**
 * 命令行功能执行
 */
export type ICommandAction = (command: Command) => any;
