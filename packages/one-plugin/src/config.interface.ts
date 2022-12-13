import { Schema } from 'joi';

export interface IConfigTransformMaterial<Value = any> {
  /**
   * 配置文件绝对路径
   */
  rcfile: string;
  /**
   * 配置文件键值
   */
  value: Value;
}

export interface IConfigDescriptor {
  /**
   * 统一配置文件属性 Key
   */
  key: string;
  /**
   * 统一配置文件属性值校验
   */
  schema: Schema;
  /**
   * 统一配置文件属性默认值
   */
  default?: ((rcFile: string) => any) | any;
  /**
   * 数据转换，常用语相对路径转绝对路径
   */
  transform?: (material: IConfigTransformMaterial) => any;
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
