// import 'reflect-metadata';
// import { createConfigFileProvider } from './ConfigFile';
// import { ReflectiveInjector } from 'injection-js';
// import { CommandRegistry } from './CommandRegistry';
// import { PivotRegistry } from './PivotRegistry';
// // explicit later

// import { ConfigManager } from './ConfigManager';
// import { CommandManager } from './CommandManager';
// import { CommandInjection } from './CommandInjection';
// import { EnvironmentManager } from './EnvironmentManager';
// import { CommandLoader } from './CommandLoader';

// (async () => {
//   // 读取配置文件职能拆分
//   const ConfigFileProvider = await createConfigFileProvider();
//   // 初始化依赖注入
//   const injector = ReflectiveInjector.resolveAndCreate([
//     ConfigFileProvider,
//     PivotRegistry,
//     ConfigManager,
//     EnvironmentManager,
//     CommandRegistry,
//     CommandManager,
//     CommandInjection,
//     CommandLoader,
//   ]);

//   // 挂载插件
//   const commandManager: CommandManager = injector.get(CommandManager);
//   const commandLoader: CommandLoader = injector.get(CommandLoader);

//   // 加载配置插件
//   await commandLoader.scan();

//   // 插件采集完毕，执行实际指令
//   await commandManager.consumeCommands();
// })();
