import Joi from 'joi';

/**
 * Joi 默认可选，除非明确 required() 调用
 * 字面量数组表示候选类型
 */
export const ProxySchema = Joi.object({
  rules: Joi.array().items(
    Joi.object({
      context: Joi.alternatives().try(
        Joi.string().required(),
        Joi.array().required().items(Joi.string().required()),
      ),
      target: Joi.string(),
      changeOrigin: Joi.bool(),
      rewrites: Joi.array().items(
        Joi.object({
          from: Joi.string().min(3).max(30).required(),
          to: Joi.string().min(3).max(30).required(),
        }),
      ),
    }),
  ),
});
