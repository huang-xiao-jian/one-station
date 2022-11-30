import type { Command } from 'commander';

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
export interface ICommandInjection {
  /**
   * 读取环境变量
   */
  env: (name: string) => any;
  /**
   * 读取文件配置内容
   */
  config: (name: string) => any;
  /**
   * 读取外源配置文件内容
   */
  cosmic: (name: string) => any;
}

/**
 * 注册子命令入参
 */
export type ICommandBehavior = (command: Command) => void;

/**
 * 命令行功能执行
 */
export type ICommandAction = (
  injection: ICommandInjection,
) => (command: Command) => void | Promise<void>;
