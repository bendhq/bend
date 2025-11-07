import { VERSIONS } from "../cli/constants.js";
import type { Answers, DependencyPlan } from "../types.js";

export function buildDeps(a: Answers): DependencyPlan {
  const deps: string[] = ["dotenv@" + VERSIONS.dotenv];
  const devDeps: string[] = ["esbuild@" + VERSIONS.esbuild, "nodemon@" + VERSIONS.nodemon];

  if (a.framework === "express") deps.push("express@" + VERSIONS.express);
  if (a.framework === "fastify") deps.push("fastify@" + VERSIONS.fastify);

  if (a.orm === "mongoose") deps.push("mongoose@" + VERSIONS.mongoose);
  if (a.orm === "prisma") {
    deps.push("@prisma/client@" + VERSIONS.prismaClient);
    devDeps.push("prisma@" + VERSIONS.prisma);
  }

  if (a.language === "ts") {
    devDeps.push("typescript@" + VERSIONS.typescript, "ts-node@" + VERSIONS.tsNode);
    if (a.framework === "express") devDeps.push("@types/express@" + VERSIONS["@types/express"]);
  }

  return { deps, devDeps };
}
