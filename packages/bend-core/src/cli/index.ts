import { program } from "commander";
import pc from "picocolors";
import { askSetup } from "./questions.js";
import { createProject } from "./actions.js";
import { META } from "./constants.js";

program
  .name("bend")
  .description("Bend - modern backend project generator and bundler.")
  .version(META.version)
  .showHelpAfterError();

program
  .command("new")
  .description("Create a new backend project")
  .action(async () => {
    try {
      const answers = await askSetup();
      await createProject(answers);
      console.log(pc.green("Project created successfully."));
    } catch (err) {
      console.error(pc.red("Error creating project."));
      if (err instanceof Error) console.error(pc.red(err.message));
      process.exit(1);
    }
  });

async function runInteractiveFlow() {
  try {
    const answers = await askSetup();
    await createProject(answers);
    console.log(pc.green("Project created successfully."));
  } catch (err) {
    console.error(pc.red("Error creating project."));
    if (err instanceof Error) console.error(pc.red(err.message));
    process.exit(1);
  }
}

async function main() {
  if (process.argv.length <= 2) {
    await runInteractiveFlow();
  } else {
    await program.parseAsync(process.argv);
  }
}

main().catch((err) => {
  console.error(pc.red("Unexpected error."));
  if (err instanceof Error) console.error(pc.red(err.message));
  process.exit(1);
});
