import pc from "picocolors";

const FRAMES = ["-", "\\", "|", "/"];

export class Spinner {
  private i = 0;
  private id: ReturnType<typeof setInterval> | null = null;
  private text = "";

  start(text = "") {
    this.text = text;
    if (this.id) return;
    this.id = setInterval(() => {
      const frame = FRAMES[(this.i = (this.i + 1) % FRAMES.length)];
      this.write(`${pc.cyan(frame)} ${this.text}`);
    }, 80);
  }

  setText(text: string) {
    this.text = text;
  }

  stop() {
    if (this.id) {
      clearInterval(this.id);
      this.id = null;
      this.clearLine();
    }
  }

  succeed(text?: string) {
    this.stop();
    if (text) this.text = text;
    process.stdout.write(`${pc.green("ok")} ${this.text}\n`);
  }

  fail(text?: string) {
    this.stop();
    if (text) this.text = text;
    process.stdout.write(`${pc.red("x")} ${this.text}\n`);
  }

  private write(s: string) {
    this.clearLine();
    process.stdout.write(s);
  }

  private clearLine() {
    process.stdout.write("\r\x1b[K");
  }
}

export const spinner = new Spinner();
