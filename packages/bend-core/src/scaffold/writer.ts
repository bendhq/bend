import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { render, loadTemplateIndex } from './renderer';
import type {
  GenerateOptions,
  GenerateResult,
  WriterOptions,
  TemplateFileMeta,
} from '../types';

const TMP_SUFFIX = '.tmp';
const DEFAULT_CONCURRENCY = Math.max(2, (os.cpus().length || 2) * 2);
const CACHE_DIR = path.join(os.homedir(), '.bend_core_cache');

function mapTargetName(name: string) {
  if (name.startsWith('_')) return '.' + name.slice(1);
  if (name.endsWith('.ejs')) return name.replace(/\.ejs$/, '');
  return name;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function isBinaryPathSync(abs: string) {
  try {
    const fd = fsSync.openSync(abs, 'r');
    const buf = Buffer.alloc(512);
    const bytes = fsSync.readSync(fd, buf, 0, 512, 0);
    fsSync.closeSync(fd);
    if (bytes === 0) return false;
    for (let i = 0; i < bytes; i++) if (buf[i] === 0) return true;
    return false;
  } catch {
    return false;
  }
}

async function sha256File(abs: string) {
  const h = crypto.createHash('sha256');
  return await new Promise<string>((res, rej) => {
    const s = fsSync.createReadStream(abs);
    s.on('data', c => h.update(c));
    s.on('end', () => res(h.digest('hex')));
    s.on('error', rej);
  });
}

function sha256BufferSync(buf: Buffer) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function writeAtomic(
  dest: string,
  bufferOrPath: Buffer | string,
  mode?: number
) {
  const dir = path.dirname(dest);
  await ensureDir(dir);
  const tmp = dest + '.' + process.pid + TMP_SUFFIX;
  if (typeof bufferOrPath === 'string') {
    await fs.copyFile(bufferOrPath, tmp);
    if (mode !== undefined) await fs.chmod(tmp, mode & 0o777);
  } else {
    await fs.writeFile(tmp, bufferOrPath);
    if (mode !== undefined) await fs.chmod(tmp, mode & 0o777);
  }
  await fs.rename(tmp, dest);
}

function pLimit(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];
  return function <T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = () => {
        active++;
        fn()
          .then(r => resolve(r))
          .catch(e => reject(e))
          .finally(() => {
            active--;
            if (queue.length > 0) {
              const next = queue.shift()!;
              next();
            }
          });
      };
      if (active < concurrency) run();
      else queue.push(run);
    });
  };
}

async function ensureCacheDir() {
  try {
    await ensureDir(CACHE_DIR);
  } catch {}
}

export async function generateProjectFromTemplate(
  opts: GenerateOptions
): Promise<GenerateResult> {
  const templatesRoot = path.resolve(opts.templatesRoot);
  const targetRoot = path.resolve(opts.targetRoot);
  const context = opts.context ?? {};
  const concurrency = opts.concurrency ?? DEFAULT_CONCURRENCY;
  const skipCache = !!opts.skipCache;
  await ensureCacheDir();
  const limit = pLimit(concurrency);
  const index = await loadTemplateIndex(templatesRoot);
  const created: string[] = [];
  const skipped: string[] = [];
  const tasks: Promise<void>[] = [];
  for (const entry of index) {
    tasks.push(
      limit(async () => {
        const rel = entry.rel;
        const src = entry.abs;
        const mapped = mapTargetName(rel);
        const dest = path.join(targetRoot, mapped);
        const st = entry as TemplateFileMeta;
        await ensureDir(path.dirname(dest));
        if (rel.endsWith('.ejs')) {
          const rendered = await render(templatesRoot, src, context);
          const buf = Buffer.from(rendered, 'utf8');
          const hash = sha256BufferSync(buf);
          const cachePath = path.join(CACHE_DIR, hash);
          if (!skipCache && fsSync.existsSync(cachePath)) {
            try {
              await fs.link(cachePath, dest);
              await fs.chmod(dest, st.mode & 0o777);
              skipped.push(dest);
              return;
            } catch {}
          }
          await writeAtomic(dest, buf, st.mode);
          created.push(dest);
          if (!skipCache) {
            try {
              await writeAtomic(cachePath, buf, st.mode);
            } catch {}
          }
          return;
        }
        const binary = isBinaryPathSync(src);
        if (binary) {
          if (!skipCache) {
            const fileHash = await sha256File(src);
            const cachePath = path.join(CACHE_DIR, fileHash);
            if (fsSync.existsSync(cachePath)) {
              try {
                await fs.link(cachePath, dest);
                await fs.chmod(dest, st.mode & 0o777);
                skipped.push(dest);
                return;
              } catch {}
            } else {
              try {
                await writeAtomic(cachePath, src, st.mode);
              } catch {}
            }
            try {
              await fs.link(cachePath, dest);
              await fs.chmod(dest, st.mode & 0o777);
              created.push(dest);
              return;
            } catch {}
          }
          await writeAtomic(dest, src, st.mode);
          created.push(dest);
          return;
        }
        const content = await fs.readFile(src, 'utf8');
        await writeAtomic(dest, Buffer.from(content, 'utf8'), st.mode);
        created.push(dest);
      })
    );
  }
  await Promise.all(tasks);
  return { success: true, targetRoot, createdFiles: created, skipped };
}

export async function writeTree(opts: WriterOptions) {
  const templatesRoot = path.resolve(opts.templatesRoot);
  const targetRoot = path.resolve(opts.targetRoot);
  const context = opts.context ?? {};
  const concurrency = opts.concurrency ?? DEFAULT_CONCURRENCY;
  const skipCache = !!opts.skipCache;
  await ensureCacheDir();
  const limit = pLimit(concurrency);
  const index = await loadTemplateIndex(templatesRoot);
  const created: string[] = [];
  const skipped: string[] = [];
  const tasks: Promise<void>[] = [];
  for (const entry of index) {
    tasks.push(
      limit(async () => {
        const rel = entry.rel;
        const src = entry.abs;
        const mapped = mapTargetName(rel);
        const dest = path.join(targetRoot, mapped);
        const st = entry as TemplateFileMeta;
        await ensureDir(path.dirname(dest));
        if (rel.endsWith('.ejs')) {
          const rendered = await render(templatesRoot, src, context);
          const buf = Buffer.from(rendered, 'utf8');
          const hash = sha256BufferSync(buf);
          const cachePath = path.join(CACHE_DIR, hash);
          if (!skipCache && fsSync.existsSync(cachePath)) {
            try {
              await fs.link(cachePath, dest);
              await fs.chmod(dest, st.mode & 0o777);
              skipped.push(dest);
              opts.onFileWritten?.(dest);
              return;
            } catch {}
          }
          await writeAtomic(dest, buf, st.mode);
          created.push(dest);
          opts.onFileWritten?.(dest);
          if (!skipCache) {
            try {
              await writeAtomic(cachePath, buf, st.mode);
            } catch {}
          }
          return;
        }
        const binary = isBinaryPathSync(src);
        if (binary) {
          if (!skipCache) {
            const fileHash = await sha256File(src);
            const cachePath = path.join(CACHE_DIR, fileHash);
            if (fsSync.existsSync(cachePath)) {
              try {
                await fs.link(cachePath, dest);
                await fs.chmod(dest, st.mode & 0o777);
                skipped.push(dest);
                opts.onFileWritten?.(dest);
                return;
              } catch {}
            } else {
              try {
                await writeAtomic(cachePath, src, st.mode);
              } catch {}
            }
            try {
              await fs.link(cachePath, dest);
              await fs.chmod(dest, st.mode & 0o777);
              created.push(dest);
              opts.onFileWritten?.(dest);
              return;
            } catch {}
          }
          await writeAtomic(dest, src, st.mode);
          created.push(dest);
          opts.onFileWritten?.(dest);
          return;
        }
        const content = await fs.readFile(src, 'utf8');
        await writeAtomic(dest, Buffer.from(content, 'utf8'), st.mode);
        created.push(dest);
        opts.onFileWritten?.(dest);
      })
    );
  }
  await Promise.all(tasks);
  return { created, skipped };
}
