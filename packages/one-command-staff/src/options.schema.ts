import Joi from 'joi';

export const StaffProviderSchema = Joi.object({
  /**
   * monorepo 直接容器目录
   */
  workspace: Joi.string().alphanum(),
  /**
   * 子项目工作目录路径
   */
  directory: Joi.string().alphanum(),
  /**
   * 子项目静态访问前缀
   */
  publicPath: Joi.string(),
});

export const StaffProviderListSchema = Joi.array().items(StaffProviderSchema);
