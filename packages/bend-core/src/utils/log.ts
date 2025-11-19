import pc from 'picocolors';

let silent = false;

export function setSilent(v: boolean) {
  silent = v;
}

function out(msg: string) {
  if (!silent) process.stdout.write(msg + '\n');
}

export const log = {
  info(msg: string) {
    out(pc.cyan(msg));
  },
  success(msg: string) {
    out(pc.green(msg));
  },
  warn(msg: string) {
    out(pc.yellow(msg));
  },
  error(msg: string) {
    out(pc.red(msg));
  },
  plain(msg: string) {
    out(msg);
  },
};
