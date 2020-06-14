import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.BODY]: {
    new_password: Joi.string().min(6).required(),
    new_password_confirmation: Joi.string()
      .required()
      .valid(Joi.ref('new_password')),
    token: Joi.string().uuid().required(),
  },
});
