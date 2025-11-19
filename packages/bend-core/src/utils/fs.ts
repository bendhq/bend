import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import os from 'os';

export async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(p: string): Promise<void> {
  await fs.mkdir(p, { recursive: true });
}

export async function readJson<T = unknown>(p: string): Promise<T> {
  const raw = await fs.readFile(p, 'utf8');
  return JSON.parse(raw) as T;
}

export async function writeJson(
  p: string,
  data: unknown,
  indent = 2
): Promise<void> {
  const tmp = `${p}.${process.pid}.tmp`;
  const dir = path.dirname(p);
  await ensureDir(dir);
  const content = JSON.stringify(data, null, indent) + os.EOL;
  await fs.writeFile(tmp, content, 'utf8');
  await fs.rename(tmp, p);
}

export async function readFile(
  p: string,
  enc: BufferEncoding = 'utf8'
): Promise<string> {
  return fs.readFile(p, enc);
}

export async function writeFileAtomic(
  p: string,
  data: string | Buffer,
  mode?: number
): Promise<void> {
  const tmp = `${p}.${process.pid}.tmp`;
  const dir = path.dirname(p);
  await ensureDir(dir);
  if (typeof data === 'string') await fs.writeFile(tmp, data, 'utf8');
  else await fs.writeFile(tmp, data);
  if (mode !== undefined) await fs.chmod(tmp, mode & 0o777);
  await fs.rename(tmp, p);
}

export async function readBinary(p: string): Promise<Buffer> {
  return fs.readFile(p);
}

export async function writeBinaryAtomic(
  p: string,
  buf: Buffer,
  mode?: number
): Promise<void> {
  await writeFileAtomic(p, buf, mode);
}

export async function copyFile(src: string, dest: string): Promise<void> {
  const dir = path.dirname(dest);
  await ensureDir(dir);
  await fs.copyFile(src, dest);
}

export async function copyDir(
  src: string,
  dest: string,
  opts?: { overwrite?: boolean }
): Promise<void> {
  const entries = await fs.readdir(src, { withFileTypes: true });
  await ensureDir(dest);
  for (const e of entries) {
    const srcp = path.join(src, e.name);
    const destp = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(srcp, destp, opts);
    else {
      if (!opts?.overwrite && (await pathExists(destp))) continue;
      await fs.copyFile(srcp, destp);
    }
  }
}

export async function rimraf(p: string): Promise<void> {
  if (!(await pathExists(p))) return;
  await fs.rm(p, { recursive: true, force: true });
}

export function pathIsSymlink(p: string): boolean {
  try {
    const st = fsSync.lstatSync(p);
    return st.isSymbolicLink();
  } catch {
    return false;
  }
}

export function readDirSync(p: string): string[] {
  return fsSync.readdirSync(p);
}

export async function stat(p: string): Promise<fsSync.Stats> {
  return fs.stat(p) as Promise<fsSync.Stats>;
}

export function isExecutableMode(mode: number): boolean {
  return Boolean(mode & 0o111);
}

export async function chmodIfExecutable(
  p: string,
  mode: number
): Promise<void> {
  try {
    if (isExecutableMode(mode)) await fs.chmod(p, mode & 0o777);
  } catch {}
}
