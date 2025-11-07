import pc from "picocolors";

export function createSpinner(text: string) {
  let interval: NodeJS.Timeout | null = null;
  const frames = ["-", "\\", "|", "/"];
  let i = 0;

  function start() {
    process.stdout.write(pc.cyan(text));
    interval = setInterval(() => {
      process.stdout.write(`\r${pc.cyan(text)} ${frames[(i = ++i % frames.length)]}`);
    }, 80);
  }

  function stop(success = true, message?: string) {
    if (interval) clearInterval(interval);
    process.stdout.write("\r");
    const prefix = success ? pc.green("✔") : pc.red("✖");
    console.log(`${prefix} ${pc.bold(message || text)}`);
  }

  return { start, stop };
}
