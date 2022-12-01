import Joi from 'joi';

const UnionTaskSchema = Joi.object({
  /**
   * 子项目工作目录路径
   */
  repo: Joi.string().uri(),
});

export const UnionOptionSchema = Joi.object({
  tasks: Joi.array().items(UnionTaskSchema),
});
