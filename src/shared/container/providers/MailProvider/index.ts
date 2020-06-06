import { container } from 'tsyringe';

import IMailProvider from './interfaces/IMailProvider';
import MailtrapProvider from './implementations/EtherealMailProvider';

container.registerSingleton<IMailProvider>('MailProvider', MailtrapProvider);
