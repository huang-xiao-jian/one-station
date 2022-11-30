import { program } from 'commander';

// TODO - 配制文件插件声明，动态加载
import { OneCommandPluginRegistry } from '@one/plugin';
import OneCommandAssemble from '@one/command-assemble';

// 初始化主命令
program.name('one').version('v0.1.0').description('yet, vscode flavor architecture for pandora');

// 实例化子命令插件调用器
const commandPluginRegistry = new OneCommandPluginRegistry();

// 插件收集
OneCommandAssemble.onCommandInit(commandPluginRegistry);

// 插件生效
for (const command of commandPluginRegistry.commands) {
  program.addCommand(command);
}

program.parseAsync();
