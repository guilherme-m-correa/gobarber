import { container } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/interfaces/ICacheProvider';

import RedisCacheProvider from './implementations/RedisCacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
