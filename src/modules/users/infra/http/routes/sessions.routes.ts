import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';
import authenticateUserValidator from '../validators/AuthenticateUserValidator';

const sessionsRouter = Router();

const sessionsController = new SessionsController();

sessionsRouter.post('/', authenticateUserValidator, sessionsController.create);

export default sessionsRouter;
