import Joi from 'joi';

const AssembleTaskSchema = Joi.object({
  /**
   * 子项目工作目录路径
   */
  directory: Joi.string().alphanum(),
  /**
   * 子项目构建产出目录，前期约定为 dist 目录，不可变更
   */
  artifact: Joi.any().valid('dist'),
  /**
   * 文件目录名
   */
  assignment: Joi.string().alphanum(),
});

export const AssembleOptionSchema = Joi.object({
  tasks: Joi.array().items(AssembleTaskSchema),
});
