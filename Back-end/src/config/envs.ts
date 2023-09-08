import dotenv from "dotenv";
import dotenvExpand from 'dotenv-expand';

export function loadEnv() {
  const currentEnvs = dotenv.config();
  dotenvExpand.expand(currentEnvs);
}