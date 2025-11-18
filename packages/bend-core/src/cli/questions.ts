import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { CLIOptions } from '../types';

export async function askQuestions(): Promise<CLIOptions> {
  const runtime = await p.select({
    message: 'Choose a runtime',
    options: [
      { value: 'nodejs', label: 'Node.js' },
      { value: 'bun', label: 'Bun' },
    ],
  });
  if (p.isCancel(runtime)) {
    p.cancel('Operation aborted');
    process.exit(1);
  }

  const language = await p.select({
    message: 'Choose a language',
    options: [
      { value: 'ts', label: 'TypeScript' },
      { value: 'js', label: 'JavaScript' },
    ],
  });
  if (p.isCancel(language)) {
    p.cancel('Operation aborted');
    process.exit(1);
  }

  const orm = await p.select({
    message: 'Choose an ORM',
    options: [
      { value: 'mongoose', label: 'Mongoose' },
      { value: 'prisma', label: 'Prisma' },
    ],
  });
  if (p.isCancel(orm)) {
    p.cancel('Operation aborted');
    process.exit(1);
  }

  const framework = await p.select({
    message: 'Choose a framework',
    options: [
      { value: 'express', label: 'Express' },
      { value: 'fastify', label: 'Fastify' },
    ],
  });
  if (p.isCancel(framework)) {
    p.cancel('Operation aborted');
    process.exit(1);
  }

  const projectName = await p.text({
    message: 'Project name',
    placeholder: 'my-app',
    defaultValue: 'my-app',
    validate(value) {
      if (!String(value).trim()) return 'Name cannot be empty';
      return undefined;
    },
  });
  if (p.isCancel(projectName)) {
    p.cancel('Operation aborted');
    process.exit(1);
  }

  p.log.info(pc.green('Configuration complete'));

  return {
    runtime: runtime as CLIOptions['runtime'],
    language: language as CLIOptions['language'],
    orm: orm as CLIOptions['orm'],
    framework: framework as CLIOptions['framework'],
    projectName: String(projectName),
  };
}
