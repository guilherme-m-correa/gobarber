import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/interfaces/IMailProvider';

import AmazonSESMailProvider from './implementations/AmazonSESMailProvider';
import EtherealMailProvider from './implementations/EtherealMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(AmazonSESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
