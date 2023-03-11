import { spawn } from 'child_process';

import { createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { logger } from '../../../common/logger';

export interface ExecuteResult {
  logFile: string;
  pid: number;
}

export interface SpawnOptions {
  cwd?: string;
}

export class Commander {
  protected binary: string;
  protected args: string[];
  private spawnOptions?: SpawnOptions;

  constructor(binary: string, args: string[], spawnOptions?: SpawnOptions) {
    this.binary = binary;
    this.args = args;
    this.spawnOptions = spawnOptions;
  }

  public async execute(onFinish: (exitCode?: number | null) => void): Promise<ExecuteResult> {
    const logFileName = join(tmpdir(), `mpbootgui-${Date.now()}.log`);
    logger.debug('Execute info', {
      binary: this.binary,
      args: this.args,
      logFileName,
    });
    await writeFile(logFileName, '');
    const logStream = createWriteStream(logFileName, { flags: 'a+' });
    const ls = spawn(this.binary, this.args, {
      ...this.spawnOptions,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (ls.pid === undefined) {
      ls.kill();
      logStream.end();
      throw new Error('Failed to run command');
    }
    ls.stdout.pipe(logStream);
    ls.stderr.pipe(logStream);

    ls.on('exit', _code => {
      logStream.end();
      onFinish(_code);
    });
    ls.on('error', err => {
      logger.error('Failed to run command', err);
    });

    return {
      logFile: logFileName,
      pid: ls.pid,
    };
  }
}
