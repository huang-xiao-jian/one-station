import { parse } from 'dotenv';
import { expand } from 'dotenv-expand';
import fs from 'fs/promises';
import { ValueProvider } from 'injection-js';
import { assign, reduce } from 'lodash';
import path from 'path';

export class OneEnvironment {
  constructor(private readonly values: Record<string, string>) {}

  get(key: string) {
    return this.values[key];
  }

  get full() {
    return { ...this.values };
  }
}

interface CreateOneEnvironmentOptions {
  /**
   * 当前工作位置
   */
  cwd: string;
  /**
   * 环境变量工作
   */
  envFile: string;
}

export async function createOneEnvironmentProvider(
  options: CreateOneEnvironmentOptions,
): Promise<ValueProvider> {
  const files = [
    path.join(options.cwd, options.envFile),
    path.join(options.cwd, `${options.envFile}.local`),
  ];

  const distribution = await Promise.all(
    files.map(async (filename) => {
      try {
        const content = await fs.readFile(filename);
        const parsed = parse(content);

        expand({
          parsed,
          ignoreProcessEnv: true,
        });

        return parsed;
      } catch (error) {
        // env file not exist, ignore branch
        return {};
      }
    }),
  );

  const assembled = reduce(distribution, (acc, curr) => assign(acc, curr), {});

  return {
    provide: OneEnvironment,
    useValue: new OneEnvironment(assembled),
  };
}
