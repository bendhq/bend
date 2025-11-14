import type { Answers, DependencyPlan } from "../types.js";

export function buildDeps(a: Answers): DependencyPlan {
  const deps: string[] = ["dotenv"];
  const devDeps: string[] = ["esbuild", "nodemon"];

  // frameworks
  if (a.framework === "express") deps.push("express");
  else if (a.framework === "fastify") deps.push("fastify");

  // orm
  if (a.orm === "mongoose") deps.push("mongoose");
  else if (a.orm === "prisma") {
    deps.push("@prisma/client");
    devDeps.push("prisma");
  }

  // typescript toolchain
  if (a.language === "typescript") {
    devDeps.push("typescript", "ts-node", "@types/node");
    if (a.framework === "express") devDeps.push("@types/express");
  }

  return { deps, devDeps };
}
