import { OnePluginHooks, ICommandRegistry, IPivotRegistry } from '@one/plugin';
import { StaffProviderListSchema } from './options.schema';

const CommandStaffToolkit: OnePluginHooks = {
  /**
   * 注册外部依赖
   */
  onConfigInit(hooks: IPivotRegistry) {
    hooks.registerConfig({
      key: 'provider',
      schema: StaffProviderListSchema,
    });
  },
  /**
   * 注册核心指令
   */
  onCommandInit(hooks: ICommandRegistry) {
    hooks
      .registerCommand({
        name: 'st-bundle',
        description: 'yet, bundle designable material',
      })
      .referenceConfig('provider')
      .defineBehavior((command) => {
        command.option('-d, --dry-run [dry]', 'whether working on file system');
      })
      .defineAction((injection) => (command) => {
        console.group('CommandStaff');
        console.log('Configuration:', injection.config('provider'));
        console.log('Arguments:', command.args);
        console.log('Options: ', command.opts());
        console.groupEnd();
      });
  },
};

export default CommandStaffToolkit;
