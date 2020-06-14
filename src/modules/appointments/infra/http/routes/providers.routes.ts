import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import listProviderMonthAvailabilityValidator from '../validators/ListProviderMonthAvailabilityValidator';
import listProviderDayAvailabilityValidator from '../validators/ListProviderDayAvailabilityValidator';

const providersRouter = Router();

const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/day-availability',
  listProviderDayAvailabilityValidator,
  providerDayAvailabilityController.index,
);
providersRouter.get(
  '/:provider_id/month-availability',
  listProviderMonthAvailabilityValidator,
  providerMonthAvailabilityController.index,
);

export default providersRouter;
