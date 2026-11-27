import { env as workerEnvironment } from 'cloudflare:workers';
// Server-only Worker bindings. Never import this module into browser code.
export function squareSetting(name: string): string {
  const value = (workerEnvironment as unknown as Record<string, unknown>)[name] ?? process.env[name];
  return typeof value === 'string' ? value : '';
}
