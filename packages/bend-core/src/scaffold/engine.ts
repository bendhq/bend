import path from 'path';
import { generateProjectFromTemplate } from './writer';

export type GenerateOptions = {
  templatesRoot: string;
  targetRoot: string;
  context?: Record<string, any>;
  skipInstall?: boolean;
};

export async function generate(options: GenerateOptions) {
  const res = await generateProjectFromTemplate(options as any);
  return res;
}

export default async function run(argv?: string[]) {
  const cwd = process.cwd();
  const templatesRoot = path.join(__dirname, '..', 'templates');
  const projectName = argv && argv[2] ? argv[2] : 'my-app';
  const targetRoot = path.join(cwd, projectName);
  await generate({ templatesRoot, targetRoot, context: { projectName } });
  return { success: true, targetRoot };
}
