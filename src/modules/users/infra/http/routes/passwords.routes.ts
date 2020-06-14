import { Router } from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';
import forgotPasswordValidator from '../validators/ForgotPasswordValidator';
import resetPasswordValidator from '../validators/ResetPasswordValidator';

const passwordRouter = Router();

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  forgotPasswordValidator,
  forgotPasswordController.create,
);
passwordRouter.post(
  '/reset',
  resetPasswordValidator,
  resetPasswordController.create,
);

export default passwordRouter;
