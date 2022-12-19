import Joi from 'joi';

export interface CommandServeOptions {
  /**
   * 开发模式 publicPath 配置
   */
  publicPath: string;
}

export const CommandServeOptionsSchema = Joi.object({
  /**
   * 开发模式配置项
   */
  publicPath: Joi.string(),
});
