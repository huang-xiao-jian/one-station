import { createCommand, program } from 'commander';

// TODO - 配制文件插件声明，动态加载
import OneCommandAssemble from '@one/command-assemble';
import { OneCommandPluginActor } from './CommandPluginActor';

// 初始化主命令
program.name('one').version('v0.1.0').description('yet, vscode flavor architecture for pandora');

// 实例化插件控件
const commandActor = new OneCommandPluginActor();

// 插件收集
OneCommandAssemble.onCommandInit(commandActor);

// 插件功能注册
commandActor.commands.forEach((cmd) => {
  // 创建独立命令行
  const command = createCommand();

  // 子命令行为声明
  command
    .name(cmd.name)
    .description(cmd.description)
    .action(async () => {
      await cmd.onAction(command);
    });

  // 子命令参数声明
  cmd.onArguments?.(command);
  cmd.onOptions?.(command);

  // 添加进入主命令行
  program.addCommand(command);
});

program.parseAsync();
