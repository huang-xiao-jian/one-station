import { createOnePlugin } from '@one/plugin-runner';

export default createOnePlugin((api) => {
  /**
   * 注册核心指令
   */
  api
    .registerCommand({
      name: 'serve',
      description: 'yet, serve single designable material',
    })
    .referenceConfig(['ourDir'])
    .defineBehavior((command) => {
      // TODO - check useful options
      // command
      //   .option('-w, --watch [watch]', 'assemble in continuous mode')
      //   .option('--no-clean', 'cleanup output directory before assemble');
    })
    .defineAction(async (command) => {
      /**
       * 命令行标准处理流程：
       *   - 参数预处理（按摩需求收集）
       *   - 工作环境预热（技师准备原材料、房间）
       *   - 功能执行
       */
    });
});
