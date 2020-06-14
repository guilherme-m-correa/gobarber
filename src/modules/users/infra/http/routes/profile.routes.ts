import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UserProfileController from '../controllers/UserProfileController';
import updateProfileValidator from '../validators/UpdateProfileValidator';

const profileRouter = Router();
const usersProfileController = new UserProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', usersProfileController.show);
profileRouter.put('/', updateProfileValidator, usersProfileController.update);

export default profileRouter;
