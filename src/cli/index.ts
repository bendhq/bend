import { program } from "commander";
import pc from "picocolors";
import { askSetup } from "./questions.js";
import { createProject } from "./actions.js";

program
  .name("bend")
  .description("Bend - modern backend project generator and bundler.")
  .version("0.0.1");

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

// If no subcommand is passed, run interactive flow directly
if (process.argv.length <= 2) {
  (async () => {
    try {
      const answers = await askSetup();
      await createProject(answers);
      console.log(pc.green("Project created successfully."));
    } catch (err) {
      console.error(pc.red("Error creating project."));
      if (err instanceof Error) console.error(pc.red(err.message));
      process.exit(1);
    }
  })();
} else {
  program.parseAsync(process.argv);
}
