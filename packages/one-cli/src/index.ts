import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

import { CommandManager } from './CommandManager';
import { createConfigFileProvider } from './ConfigFile';
import { createOneEnvironmentProvider } from './OneEnvironment';
import { OnePlatform } from './OnePlatform';
import { OnePluginLoader } from './OnePluginLoader';

(async () => {
  // 读取环境配置文件拆分
  const extraEnv = process.env.ONE_EXTRA_ENV || 'local';
  const OneEnvironmentProvider = await createOneEnvironmentProvider({
    cwd: process.cwd(),
    envFile: '.env',
    extraEnv,
  });
  // 读取配置文件职能拆分
  const ConfigFileProvider = await createConfigFileProvider();
  // 初始化依赖注入
  const injector = ReflectiveInjector.resolveAndCreate([
    OneEnvironmentProvider,
    ConfigFileProvider,
    CommandManager,
    OnePluginLoader,
    OnePlatform,
  ]);

  // 挂载插件
  const onePluginLoader: OnePluginLoader = injector.get(OnePluginLoader);
  const commandManager: CommandManager = injector.get(CommandManager);

  // 加载配置插件
  await onePluginLoader.scan();

  // 插件采集完毕，执行实际指令
  await commandManager.bootstrap();
})();
