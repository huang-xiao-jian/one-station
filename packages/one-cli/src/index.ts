import 'reflect-metadata';

import { ReflectiveInjector } from 'injection-js';

import { CommandLoader } from './CommandLoader';
import { CommandManager } from './CommandManager';
import { createConfigFileProvider } from './ConfigFile';
import { createOneEnvironmentProvider } from './OneEnvironment';
import { OnePlatform } from './OnePlatform';

(async () => {
  // 读取环境配置文件拆分
  const OneEnvironmentProvider = await createOneEnvironmentProvider({
    cwd: process.cwd(),
    envFile: '.env',
  });
  // 读取配置文件职能拆分
  const ConfigFileProvider = await createConfigFileProvider();
  // 初始化依赖注入
  const injector = ReflectiveInjector.resolveAndCreate([
    OneEnvironmentProvider,
    ConfigFileProvider,
    CommandManager,
    CommandLoader,
    OnePlatform,
  ]);

  // 挂载插件
  const commandManager: CommandManager = injector.get(CommandManager);
  const commandLoader: CommandLoader = injector.get(CommandLoader);

  // 加载配置插件
  await commandLoader.scan();

  // 插件采集完毕，执行实际指令
  await commandManager.bootstrap();
})();
