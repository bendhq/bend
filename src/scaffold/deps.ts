import type { Answers, DependencyPlan } from "../types.js";

export function buildDeps(a: Answers): DependencyPlan {
  const deps: string[] = ["dotenv"];
  const devDeps: string[] = ["esbuild", "nodemon"];

  if (a.framework === "express") deps.push("express");
  if (a.framework === "fastify") deps.push("fastify");

  if (a.orm === "mongoose") deps.push("mongoose");
  if (a.orm === "prisma") {
    deps.push("@prisma/client");
    devDeps.push("prisma");
  }

  if (a.language === "typescript") {
    devDeps.push("typescript", "ts-node", "@types/node");

    if (a.framework === "express") {
      devDeps.push("@types/express");
    } else if (a.framework === "fastify") {
      devDeps.push("@types/fastify");
    }
  }

  return { deps, devDeps };
}
