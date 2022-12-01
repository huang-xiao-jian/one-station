import { OnePluginHooks, ICommandRegistry, IPivotRegistry } from '@one/plugin';
import { UnionOptionSchema } from './options.schema';

const OneCommandUnion: OnePluginHooks = {
  /**
   * 注册外部依赖
   */
  onConfigInit(hooks: IPivotRegistry) {
    hooks.registerConfig({
      key: 'union',
      schema: UnionOptionSchema,
    });
  },
  /**
   * 注册核心指令
   */
  onCommandInit(hooks: ICommandRegistry) {
    hooks
      .registerCommand({
        name: 'union',
        description: 'yet, union plugin to aggregate gitlab repo',
      })
      .referenceConfig('union')
      .defineBehavior((command) => {
        command.option('-d, --dry-run [dry]', 'whether working on file system');
      })
      .defineAction((injection) => (command) => {
        console.group('OneCommandUnion');
        console.log('Configuration:', injection.config('union'));
        console.log('Arguments:', command.args);
        console.log('Options: ', command.opts());
        console.groupEnd();
      });
  },
};

export default OneCommandUnion;
