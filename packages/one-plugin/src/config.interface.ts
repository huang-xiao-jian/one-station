import { Schema } from 'joi';

export interface IConfigDescriptor {
  /**
   * 统一配置文件属性 Key
   */
  key: string;
  /**
   * 统一配置文件属性默认值
   */
  default?: any;
  /**
   * 统一配置文件属性值校验
   */
  schema: Schema;
}

/**
 * 环境变量依赖描述
 */
export interface IEnvironmentVariableDescriptor {
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
  default?: any;
  /**
   * 入参转换函数，可选
   * 命令行默认参数为字符串
   */
  transform?: (raw: string) => any;
}

export interface ICosmiConfigDescriptor {
  /**
   * 外置配置名，参考 cosmic 风格
   */
  name: string;
  /**
   * 外置配置校验
   */
  schema: Schema;
}

export interface IConfigRegistry {
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
