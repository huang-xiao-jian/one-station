import 'reflect-metadata';
import { program } from 'commander';
import { ReflectiveInjector } from 'injection-js';
import { CommandAccessor } from './CommandAccessor';
import { CommandRegistry } from './CommandRegistry';
import { PivotRegistry } from './PivotRegistry';
// explicit later
import CommandAssemble from '@one/command-assemble';
import CommandCore from '@one/command-core';

// 初始化依赖注入
const injector = ReflectiveInjector.resolveAndCreate([
  PivotRegistry,
  CommandRegistry,
  CommandAccessor,
]);

// 初始化主命令
program.name('one').version('v0.1.0').description('yet, vscode flavor architecture for pandora');

// 挂载插件
const pivotRegistry: PivotRegistry = injector.get(PivotRegistry);
const commandRegistry: CommandRegistry = injector.get(CommandRegistry);

// 标准化模板代码
CommandAssemble.onConfigInit?.(pivotRegistry);
CommandAssemble.onCommandInit?.(commandRegistry);
CommandCore.onConfigInit?.(pivotRegistry);
CommandCore.onCommandInit?.(commandRegistry);

// 添加子命令
commandRegistry.commands.forEach((command) => {
  program.addCommand(command);
});

program.parseAsync();
