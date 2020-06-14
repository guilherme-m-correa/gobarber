interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethrereal',
  defaults: {
    from: {
      email: 'guilherme@dev.com.br',
      name: 'Guilherme',
    },
  },
} as IMailConfig;
