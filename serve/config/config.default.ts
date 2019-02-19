import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo): PowerPartial<EggAppConfig> & typeof bizConfig => {
  const config = {} as PowerPartial<EggAppConfig>;

  /**
   * System configuration
   */
  // Key of cookies
  config.keys = appInfo.name + '_1550500108095_1703';

  // Nginx proxy
  config.proxy = true;

  /**
   * Middlewares and their configuration
   */
  // Enabled global middlewares
  config.middleware = ['errcode'];

  config.auth = {
    expiresIn: 7200,
  };

  // `bodyParser` will parse body to object automatically
  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  };

  // `listen.path` supports unix sock path
  config.cluster = {
    listen: {
      path: '',
      port: 7001,
    },
  };

  // 404 not found
  config.notfound = {
    pageUrl: '/exception/404',
  };

  /**
   * Other configuration for controller or service
   */
  const bizConfig = {
    user: {
      loginRedirect: '/position/manage/list',
    },
  };

  return {
    ...config,
    ...bizConfig,
  };
};
