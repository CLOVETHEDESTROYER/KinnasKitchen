import 'server-only';
// Vercel and Next.js load private environment variables on the server.
export function squareSetting(name: string): string {
  return process.env[name] || '';
}
