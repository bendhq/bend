const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let handle: NodeJS.Timeout | null = null;
let idx = 0;
let message = '';
let enabled = true;

export function setEnabled(v: boolean) {
  enabled = v;
}

export function start(msg = '') {
  if (!enabled) return;
  stop();
  message = msg;
  idx = 0;
  handle = setInterval(() => {
    try {
      process.stdout.write(`\r${FRAMES[idx % FRAMES.length]} ${message}`);
      idx++;
    } catch {}
  }, 80) as unknown as NodeJS.Timeout;
}

export function update(msg: string) {
  if (!enabled) return;
  message = msg;
}

export function stop() {
  if (handle) {
    clearInterval(handle);
    handle = null;
    try {
      process.stdout.write('\r\x1b[K');
    } catch {}
  }
}

export function succeed(msg?: string) {
  stop();
  if (!enabled) return;
  try {
    process.stdout.write(`\r✔ ${msg ?? message}\n`);
  } catch {}
}

export function fail(msg?: string) {
  stop();
  if (!enabled) return;
  try {
    process.stdout.write(`\r✖ ${msg ?? message}\n`);
  } catch {}
}
