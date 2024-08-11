import { EnvVariables } from './vite.config';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariables {}
  }
}
