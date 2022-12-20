import compression from 'compression';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import serve from 'serve-static';

import { SimulateOptions } from './options';

export class SimulateHandler {
  async serve(options: SimulateOptions) {
    const app = express();
    const { default: chalk } = await import('chalk');

    /**
     * request
     */
    app.use(morgan('tiny'));

    /**
     * cors
     *
     * @link - https://github.com/umijs/umi/blob/c6a9a506afe6d77d472fddedd8a6d507a0525c47/packages/preset-umi/src/commands/preview.ts#L39
     */
    app.use(
      cors({
        methods: 'GET,PUT,POST,DELETE,HEAD,PATCH,OPTIONS',
        allowedHeaders: 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With',
      }),
    );

    /**
     * TODO - compression
     *
     * @link - https://github.com/umijs/umi/blob/c6a9a506afe6d77d472fddedd8a6d507a0525c47/packages/preset-umi/src/commands/preview.ts#L53
     */
    app.use(compression());

    /**
     * TODO - base support
     */

    /**
     * TODO - proxy
     */

    /**
     * TODO - mockery
     */

    /**
     * 静态文件
     */
    app.use(
      serve(options.rootDir, {
        maxAge: '2d',
        setHeaders(res, filepath) {
          const basename = path.basename(filepath);
          const filenames = [/^mf-entry\./, /[a-zA-Z0-9]\.html$/];

          if (filenames.some((pattern) => pattern.test(basename))) {
            // Cache-Control for none hashed files
            res.setHeader('Cache-Control', 'public, max-age=0');
          }
        },
      }),
    );

    /**
     * browser history fallback
     */
    app.use(history());

    /**
     * TODO - http / https
     */

    /**
     * bootstrap
     */
    const { protocol, host, port } = options;
    const server = http.createServer(app);

    server.listen(options.port, () => {
      const prefix = chalk.green('Ready');
      const notification = `App listening at ${chalk.green(`${protocol}//${host}:${port}`)}`;

      console.log(`${prefix} - ${notification}`);
    });
  }
}
