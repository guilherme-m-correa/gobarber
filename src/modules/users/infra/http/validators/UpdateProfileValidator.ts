import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    new_password: Joi.string()
      .min(6)
      .when('old_password', { then: Joi.required() }),
    new_password_confirmation: Joi.string()
      .valid(Joi.ref('new_password'))
      .when('old_password', { then: Joi.required() }),
  },
});
