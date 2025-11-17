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
  Context,
} from '../types';

const TMP = '.tmp';
const CONCURRENCY = Math.max(2, (os.cpus().length || 2) * 2);
const CACHE = path.join(os.homedir(), '.bend_core_cache');

function mapName(n: string) {
  if (n.startsWith('_')) return '.' + n.slice(1);
  if (n.endsWith('.ejs')) return n.slice(0, -4);
  return n;
}

async function mkdir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

function isBinarySync(abs: string) {
  try {
    const fd = fsSync.openSync(abs, 'r');
    const buf = Buffer.alloc(400);
    const bytes = fsSync.readSync(fd, buf, 0, 400, 0);
    fsSync.closeSync(fd);
    if (bytes === 0) return false;
    for (let i = 0; i < bytes; i++) if (buf[i] === 0) return true;
    return false;
  } catch {
    return false;
  }
}

async function hashFile(abs: string) {
  const h = crypto.createHash('sha256');
  return await new Promise<string>((res, rej) => {
    const s = fsSync.createReadStream(abs);
    s.on('data', d => h.update(d));
    s.on('end', () => res(h.digest('hex')));
    s.on('error', rej);
  });
}

function hashBuf(buf: Buffer) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function atomicWrite(dest: string, src: Buffer | string, mode?: number) {
  const dir = path.dirname(dest);
  await mkdir(dir);
  const tmp = dest + '.' + process.pid + TMP;
  if (typeof src === 'string') await fs.copyFile(src, tmp);
  else await fs.writeFile(tmp, src);
  if (mode !== undefined) await fs.chmod(tmp, mode & 0o777);
  await fs.rename(tmp, dest);
}

function limitPool(n: number) {
  let active = 0;
  const q: Array<() => void> = [];
  return function <T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = () => {
        active++;
        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            active--;
            if (q.length > 0) q.shift()!();
          });
      };
      if (active < n) run();
      else q.push(run);
    });
  };
}

async function ensureCache() {
  try {
    await mkdir(CACHE);
  } catch {}
}

async function handleEjs(
  entry: TemplateFileMeta,
  templatesRoot: string,
  dest: string,
  context: Context,
  skipCache: boolean,
  created: string[],
  skipped: string[]
) {
  const rendered = await render(templatesRoot, entry.abs, context);
  const buf = Buffer.from(rendered, 'utf8');
  const sum = hashBuf(buf);
  const cache = path.join(CACHE, sum);
  if (!skipCache && fsSync.existsSync(cache)) {
    try {
      await fs.link(cache, dest);
      await fs.chmod(dest, entry.mode & 0o777);
      skipped.push(dest);
      return;
    } catch {}
  }
  await atomicWrite(dest, buf, entry.mode);
  created.push(dest);
  if (!skipCache) {
    try {
      await atomicWrite(cache, buf, entry.mode);
    } catch {}
  }
}

async function handleBinary(
  entry: TemplateFileMeta,
  dest: string,
  skipCache: boolean,
  created: string[],
  skipped: string[]
) {
  if (!skipCache) {
    const sum = await hashFile(entry.abs);
    const cache = path.join(CACHE, sum);
    if (fsSync.existsSync(cache)) {
      try {
        await fs.link(cache, dest);
        await fs.chmod(dest, entry.mode & 0o777);
        skipped.push(dest);
        return;
      } catch {}
    } else {
      try {
        await atomicWrite(cache, entry.abs, entry.mode);
      } catch {}
    }
    try {
      await fs.link(cache, dest);
      await fs.chmod(dest, entry.mode & 0o777);
      created.push(dest);
      return;
    } catch {}
  }
  await atomicWrite(dest, entry.abs, entry.mode);
  created.push(dest);
}

async function handleText(
  entry: TemplateFileMeta,
  dest: string,
  created: string[]
) {
  const raw = await fs.readFile(entry.abs, 'utf8');
  await atomicWrite(dest, Buffer.from(raw, 'utf8'), entry.mode);
  created.push(dest);
}

export async function generateProjectFromTemplate(
  opts: GenerateOptions
): Promise<GenerateResult> {
  const root = path.resolve(opts.templatesRoot);
  const out = path.resolve(opts.targetRoot);
  const ctx = (opts.context ?? {}) as Context;
  const skipCache = !!opts.skipCache;
  const lim = limitPool(opts.concurrency ?? CONCURRENCY);

  await ensureCache();
  const index: TemplateFileMeta[] = await loadTemplateIndex(root);

  const created: string[] = [];
  const skipped: string[] = [];

  const work = index.map(entry =>
    lim(async () => {
      const rel = mapName(entry.rel);
      const dest = path.join(out, rel);
      await mkdir(path.dirname(dest));
      if (entry.rel.endsWith('.ejs'))
        return handleEjs(entry, root, dest, ctx, skipCache, created, skipped);
      if (isBinarySync(entry.abs))
        return handleBinary(entry, dest, skipCache, created, skipped);
      return handleText(entry, dest, created);
    })
  );

  await Promise.all(work);

  return { success: true, targetRoot: out, createdFiles: created, skipped };
}

export async function writeTree(opts: WriterOptions) {
  const root = path.resolve(opts.templatesRoot);
  const out = path.resolve(opts.targetRoot);
  const ctx = (opts.context ?? {}) as Context;
  const skipCache = !!opts.skipCache;
  const lim = limitPool(opts.concurrency ?? CONCURRENCY);

  await ensureCache();
  const index: TemplateFileMeta[] = await loadTemplateIndex(root);

  const created: string[] = [];
  const skipped: string[] = [];

  const work = index.map(entry =>
    lim(async () => {
      const rel = mapName(entry.rel);
      const dest = path.join(out, rel);
      await mkdir(path.dirname(dest));
      if (entry.rel.endsWith('.ejs')) {
        const rendered = await render(root, entry.abs, ctx);
        const buf = Buffer.from(rendered, 'utf8');
        const sum = hashBuf(buf);
        const cache = path.join(CACHE, sum);
        if (!skipCache && fsSync.existsSync(cache)) {
          try {
            await fs.link(cache, dest);
            await fs.chmod(dest, entry.mode & 0o777);
            skipped.push(dest);
            opts.onFileWritten?.(dest);
            return;
          } catch {}
        }
        await atomicWrite(dest, buf, entry.mode);
        created.push(dest);
        opts.onFileWritten?.(dest);
        if (!skipCache) {
          try {
            await atomicWrite(cache, buf, entry.mode);
          } catch {}
        }
        return;
      }
      if (isBinarySync(entry.abs)) {
        if (!skipCache) {
          const sum = await hashFile(entry.abs);
          const cache = path.join(CACHE, sum);
          if (fsSync.existsSync(cache)) {
            try {
              await fs.link(cache, dest);
              await fs.chmod(dest, entry.mode & 0o777);
              skipped.push(dest);
              opts.onFileWritten?.(dest);
              return;
            } catch {}
          } else {
            try {
              await atomicWrite(cache, entry.abs, entry.mode);
            } catch {}
          }
          try {
            await fs.link(cache, dest);
            await fs.chmod(dest, entry.mode & 0o777);
            created.push(dest);
            opts.onFileWritten?.(dest);
            return;
          } catch {}
        }
        await atomicWrite(dest, entry.abs, entry.mode);
        created.push(dest);
        opts.onFileWritten?.(dest);
        return;
      }
      const raw = await fs.readFile(entry.abs, 'utf8');
      await atomicWrite(dest, Buffer.from(raw, 'utf8'), entry.mode);
      created.push(dest);
      opts.onFileWritten?.(dest);
    })
  );

  await Promise.all(work);

  return { created, skipped };
}
