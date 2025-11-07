import pc from "picocolors";

export const log = {
  info: (msg: string) => console.log(pc.cyan(`[bend] ${msg}`)),
  success: (msg: string) => console.log(pc.green(`[bend] ${msg}`)),
  warn: (msg: string) => console.warn(pc.yellow(`[bend] ${msg}`)),
  error: (msg: string) => console.error(pc.red(`[bend] ${msg}`))
};
