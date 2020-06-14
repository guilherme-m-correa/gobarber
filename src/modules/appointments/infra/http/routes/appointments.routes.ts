import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';
import createAppointmentsValidator from '../validators/CreateAppointmentsValidator';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  createAppointmentsValidator,
  appointmentsController.create,
);

appointmentsRouter.get('/schedule', providerAppointmentsController.index);

export default appointmentsRouter;
