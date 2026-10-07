import { build } from './build.mjs';
import { startServer } from '../web/server.mjs';
await build();
const server = await startServer();
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
