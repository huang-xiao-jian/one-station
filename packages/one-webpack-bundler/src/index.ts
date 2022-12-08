import _ from 'lodash';

import { build } from './build';

(async () => {
  await build({
    root: '/Users/user/za_tech/genesis-greatstaff',
    cwd: '/Users/user/za_tech/genesis-greatstaff/packages/prudential',
    publicPath: '/',
  });
})();
