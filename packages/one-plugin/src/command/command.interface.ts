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
 * 环境变量定义对
 */
export interface IEnvironmentPair {
  name: string;
  value: any;
}

/**
 * 命令行依赖外部数据注入
 */
export interface ICommandInjection {
  env: (name: string) => any;
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

/**
 * 环境变量依赖描述
 */
export interface ICommandEnvironmentDescriptor<T = any> {
  /**
   * 环境变量声明
   */
  name: string;
  /**
   * 环境变量说明
   */
  description: string;
  /**
   * 环境变量默认值，可选
   */
  default?: T;
  /**
   * 入参转换函数，可选
   * 命令行默认参数为字符串
   */
  transform?: (raw: string) => T;
}
