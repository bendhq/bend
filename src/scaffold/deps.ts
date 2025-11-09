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

  if (a.language === "ts") {
    devDeps.push("typescript", "ts-node");
    if (a.framework === "express") devDeps.push("@types/express");
  }

  return { deps, devDeps };
}
