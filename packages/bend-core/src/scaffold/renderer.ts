import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import crypto from 'crypto';
import ejs from 'ejs';
import type {
  Context,
  TemplateFileMeta,
  CompiledManifest,
  RenderResult,
} from '../types';

class LRU<K, V> {
  private map = new Map<K, V>();
  private capacity: number;
  constructor(capacity = 1000) {
    this.capacity = capacity;
  }
  get(key: K): V | undefined {
    const v = this.map.get(key);
    if (v === undefined) return undefined;
    this.map.delete(key);
    this.map.set(key, v);
    return v;
  }
  set(key: K, value: V) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const it = this.map.keys();
      const first = it.next();
      if (!first.done) {
        this.map.delete(first.value as K);
      }
    }
  }
  clear() {
    this.map.clear();
  }
}


type CompiledEntry =
  | { type: 'compiled'; modulePath: string }
  | { type: 'file'; filePath: string };

const DEFAULT_CACHE_SIZE = Math.max(
  1000,
  (require('os').cpus().length || 2) * 200
);
const renderCache = new LRU<string, string>(DEFAULT_CACHE_SIZE);
const compiledTemplateCache = new Map<string, CompiledEntry>();
let compiledManifest: CompiledManifest | null = null;

async function hashContext(ctx: Context): Promise<string> {
  try {
    const s = JSON.stringify(ctx, Object.keys(ctx).sort());
    return crypto.createHash('sha256').update(s).digest('hex');
  } catch {
    return crypto.createHash('sha256').update(String(ctx)).digest('hex');
  }
}

async function loadCompiledManifest(dir: string): Promise<void> {
  const manifestPath = path.join(dir, 'manifest.json');
  if (!fsSync.existsSync(manifestPath)) return;
  const raw = await fs.readFile(manifestPath, 'utf8');
  const m = JSON.parse(raw) as CompiledManifest;
  compiledManifest = m;
  for (const rel of Object.keys(m)) {
    const entry = m[rel];
    if (entry.compiled) {
      const modPath = path.join(dir, entry.compiled);
      compiledTemplateCache.set(rel.replace(/\\/g, '/'), {
        type: 'compiled',
        modulePath: modPath,
      });
    } else {
      const filePath = path.join(dir, rel);
      compiledTemplateCache.set(rel.replace(/\\/g, '/'), {
        type: 'file',
        filePath,
      });
    }
  }
}

export async function initRenderer(opts: {
  templatesRoot: string;
  distCompiledRoot?: string;
}): Promise<void> {
  compiledTemplateCache.clear();
  compiledManifest = null;
  const dist =
    opts.distCompiledRoot ??
    path.join(opts.templatesRoot, '..', '..', 'dist', 'templates-compiled');
  if (fsSync.existsSync(dist)) await loadCompiledManifest(dist);
}

function relKey(root: string, file: string): string {
  return path.relative(root, file).replace(/\\/g, '/');
}

async function renderWithCompiled(
  modulePath: string,
  context: Context
): Promise<string> {
  const key = `${modulePath}|${await hashContext(context)}`;
  const cached = renderCache.get(key);
  if (cached) return cached;
  const mod = await import(/* @vite-ignore */ `file://${modulePath}`);
  const fn = (mod && (mod.default || mod.render || mod)) as
    | ((d: any) => string)
    | undefined;
  if (typeof fn !== 'function')
    throw new Error('compiled template export is not a function');
  const out = fn(context);
  renderCache.set(key, out);
  return out;
}

async function renderFileTemplate(
  filePath: string,
  context: Context
): Promise<string> {
  const key = `${filePath}|${await hashContext(context)}`;
  const cached = renderCache.get(key);
  if (cached) return cached;
  const rendered = await ejs.renderFile(filePath, context, {
    async: true,
    rmWhitespace: true,
  });
  renderCache.set(key, rendered);
  return rendered;
}

export async function render(
  templatesRoot: string,
  absTemplatePath: string,
  context: Context = {}
): Promise<string> {
  const rel = relKey(templatesRoot, absTemplatePath);
  const compiled = compiledTemplateCache.get(rel);
  if (compiled && compiled.type === 'compiled')
    return renderWithCompiled(compiled.modulePath, context);
  return renderFileTemplate(absTemplatePath, context);
}

export async function loadTemplateIndex(
  templatesRoot: string
): Promise<TemplateFileMeta[]> {
  const out: TemplateFileMeta[] = [];
  async function walk(dir: string) {
    const names = await fs.readdir(dir);
    for (const name of names) {
      const abs = path.join(dir, name);
      const st = await fs.stat(abs);
      if (st.isDirectory()) await walk(abs);
      else {
        out.push({
          rel: relKey(templatesRoot, abs),
          abs,
          isDirectory: false,
          size: st.size,
          mode: st.mode,
          mtimeMs: st.mtimeMs,
        });
      }
    }
  }
  await walk(templatesRoot);
  return out;
}

export function clearRenderCache(): void {
  renderCache.clear();
  compiledTemplateCache.clear();
  compiledManifest = null;
}
