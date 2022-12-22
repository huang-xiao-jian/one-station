import Joi from 'joi';

export const URLRewriteRuleSchema = Joi.array().items(
  Joi.object({
    from: Joi.string().min(3).max(30).required(),
    to: Joi.string().min(3).max(30).required(),
  }),
);
