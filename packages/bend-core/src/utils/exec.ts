import {
  spawn as _spawn,
  spawnSync as _spawnSync,
  SpawnOptions,
} from 'child_process';
import path from 'path';

type CommonOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  shell?: boolean | string;
  stdio?: 'pipe' | 'inherit' | Array<any>;
  timeout?: number;
};

export interface ExecResult {
  code: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
  error?: Error;
}

function isBun(): boolean {
  // @ts-ignore
  return typeof (globalThis as any).Bun !== 'undefined';
}

export async function exec(
  cmd: string,
  args: string[] = [],
  opts: CommonOptions = {}
): Promise<ExecResult> {
  if (isBun()) {
    // @ts-ignore
    const Bun: any = globalThis.Bun;
    const spawnArgs = [cmd, ...(args || [])];
    const spawnOpts: any = {
      cwd: opts.cwd ?? process.cwd(),
      env: opts.env ?? process.env,
      shell: !!opts.shell,
    };
    try {
      // @ts-ignore
      const res = Bun.spawnSync(spawnArgs, spawnOpts);
      return {
        code: res.exitCode ?? null,
        signal: null,
        stdout:
          typeof res.stdout === 'string'
            ? res.stdout
            : Buffer.from(res.stdout || '').toString('utf8'),
        stderr:
          typeof res.stderr === 'string'
            ? res.stderr
            : Buffer.from(res.stderr || '').toString('utf8'),
      };
    } catch (err: any) {
      return {
        code: null,
        signal: null,
        stdout: '',
        stderr: String(err.stack ?? err.message ?? err),
        error: err,
      };
    }
  }

  return new Promise<ExecResult>(resolve => {
    const cwd = opts.cwd ?? process.cwd();
    const spawnOpts: SpawnOptions = {
      cwd,
      env: opts.env ?? process.env,
      shell: Boolean(opts.shell),
    };
    const child = _spawn(cmd, args, spawnOpts);
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', b => (stdout += String(b)));
    child.stderr?.on('data', b => (stderr += String(b)));
    child.on('error', err =>
      resolve({
        code: null,
        signal: null,
        stdout,
        stderr: stderr + String(err),
        error: err,
      })
    );
    child.on('close', (code, signal) =>
      resolve({ code, signal, stdout, stderr })
    );
  });
}

export function execSync(
  cmd: string,
  args: string[] = [],
  opts: CommonOptions = {}
): ExecResult {
  if (isBun()) {
    // @ts-ignore
    const Bun: any = globalThis.Bun;
    try {
      // @ts-ignore
      const res = Bun.spawnSync([cmd, ...(args || [])], {
        cwd: opts.cwd ?? process.cwd(),
        env: opts.env ?? process.env,
        shell: !!opts.shell,
      });
      return {
        code: res.exitCode ?? null,
        signal: null,
        stdout:
          typeof res.stdout === 'string'
            ? res.stdout
            : Buffer.from(res.stdout || '').toString('utf8'),
        stderr:
          typeof res.stderr === 'string'
            ? res.stderr
            : Buffer.from(res.stderr || '').toString('utf8'),
      };
    } catch (err: any) {
      return {
        code: null,
        signal: null,
        stdout: '',
        stderr: String(err.stack ?? err.message ?? err),
        error: err,
      };
    }
  }

  const cwd = opts.cwd ?? process.cwd();
  const spawned = _spawnSync(cmd, args, {
    cwd,
    env: opts.env ?? process.env,
    shell: Boolean(opts.shell),
  });
  const stdout = spawned.stdout ? spawned.stdout.toString('utf8') : '';
  const stderr = spawned.stderr ? spawned.stderr.toString('utf8') : '';
  return {
    code: spawned.status ?? null,
    signal: spawned.signal ?? null,
    stdout,
    stderr,
    error: spawned.error ?? undefined,
  };
}

export function resolveBin(name: string, cwd = process.cwd()): string | null {
  try {
    const p = require.resolve(path.join(name, 'package.json'), {
      paths: [cwd],
    });
    return path.dirname(p);
  } catch {
    return null;
  }
}
