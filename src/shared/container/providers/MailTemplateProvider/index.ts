import { container } from 'tsyringe';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/interfaces/IMailTemplateProvider';

import HandlebarsMailTemplateProvider from './implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);
