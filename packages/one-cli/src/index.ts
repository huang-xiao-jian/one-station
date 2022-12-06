import 'reflect-metadata';
import { program } from 'commander';
import { createConfigFileProvider } from './ConfigFile';
import { ReflectiveInjector } from 'injection-js';
import { CommandRegistry } from './CommandRegistry';
import { PivotRegistry } from './PivotRegistry';
// explicit later
import CommandAssemble from '@one/command-assemble';
import CommandCore from '@one/command-core';
import { ConfigManager } from './ConfigManager';
import { CommandManager } from './CommandManager';
import { CommandInjection } from './CommandInjection';
import { EnvironmentManager } from './EnvironmentManager';

(async () => {
  // 读取配置文件职能拆分
  const ConfigFileProvider = await createConfigFileProvider();
  // 初始化依赖注入
  const injector = ReflectiveInjector.resolveAndCreate([
    ConfigFileProvider,
    PivotRegistry,
    ConfigManager,
    EnvironmentManager,
    CommandRegistry,
    CommandManager,
    CommandInjection,
  ]);

  // 挂载插件
  const pivotRegistry: PivotRegistry = injector.get(PivotRegistry);
  const commandRegistry: CommandRegistry = injector.get(CommandRegistry);
  const commandManager: CommandManager = injector.get(CommandManager);

  // 标准化模板代码
  CommandAssemble.onConfigInit?.(pivotRegistry);
  CommandAssemble.onCommandInit?.(commandRegistry);
  CommandCore.onConfigInit?.(pivotRegistry);
  CommandCore.onCommandInit?.(commandRegistry);

  // 插件采集完毕，执行实际指令
  await commandManager.consumeCommands();
})();
