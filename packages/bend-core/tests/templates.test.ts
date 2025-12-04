import { describe, test, expect, beforeAll } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';

// Get templates directory relative to project root
const ROOT = resolve(__dirname, '..');
const TEMPLATES = join(ROOT, 'src', 'scaffold', 'templates', 'stacks');

const JS = ['js/js-mongoose-express', 'js/js-mongoose-fastify', 'js/js-prisma-express', 'js/js-prisma-fastify'];
const TS = ['ts/ts-mongoose-express', 'ts/ts-mongoose-fastify', 'ts/ts-prisma-express', 'ts/ts-prisma-fastify'];
const ALL = [...JS, ...TS];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const file of readdirSync(dir)) {
    const full = join(dir, file);
    if (statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function getFiles(t: string): string[] {
  const base = join(TEMPLATES, t);
  return walk(base).map(f => f.slice(base.length + 1).replace(/\\/g, '/'));
}

function hasFile(t: string, p: string | RegExp): boolean {
  const f = getFiles(t);
  return typeof p === 'string' ? f.some(x => x.includes(p)) : f.some(x => p.test(x));
}

function readContent(t: string, p: string | RegExp): string {
  const f = getFiles(t);
  const m = f.find(x => typeof p === 'string' ? x.includes(p) : p.test(x));
  return m ? readFileSync(join(TEMPLATES, t, m), 'utf-8') : '';
}

describe('Templates', () => {
  beforeAll(() => {
    // Debug: log path to help troubleshoot
    console.log('Templates dir:', TEMPLATES);
    console.log('Exists:', existsSync(TEMPLATES));
  });

  test('templates directory exists', () => {
    expect(existsSync(TEMPLATES)).toBe(true);
  });

  describe.each(ALL)('%s', (t) => {
    test('has files', () => expect(getFiles(t).length).toBeGreaterThan(0));
    test('has package.json.ejs', () => expect(hasFile(t, 'package.json.ejs')).toBe(true));
    test('has health controller', () => expect(hasFile(t, /health\.controller/)).toBe(true));
    test('has health routes', () => expect(hasFile(t, /health\.routes/)).toBe(true));
  });

  describe.each(TS)('TS: %s', (t) => {
    test('has tsconfig.json', () => expect(hasFile(t, 'tsconfig.json')).toBe(true));
    test('no require()', () => expect(readContent(t, /health\.controller\.ts/)).not.toMatch(/require\s*\(/));
  });

  describe.each(JS)('JS: %s', (t) => {
    test('no TS imports', () => expect(readContent(t, /health\.routes\.js/)).not.toMatch(/FastifyInstance/));
  });

  describe.each(ALL.filter(x => x.includes('prisma')))('Prisma: %s', (t) => {
    test('has schema.prisma', () => expect(hasFile(t, 'schema.prisma')).toBe(true));
    test('no src/prisma', () => expect(getFiles(t).some(f => f.startsWith('src/prisma/'))).toBe(false));
    test('no src/_env.ejs', () => expect(getFiles(t).some(f => f === 'src/_env.ejs')).toBe(false));
  });

  describe.each(ALL.filter(x => x.includes('mongoose')))('Mongoose: %s', (t) => {
    test('has mongoose import', () => expect(readContent(t, /health\.controller/)).toMatch(/mongoose/i));
  });
});
