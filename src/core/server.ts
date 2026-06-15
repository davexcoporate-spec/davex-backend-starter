import { createApp } from "./app";
import { env } from "./config";
import { logger } from "./logger";

const app = createApp();

app.listen(env.port, () => {
  logger.info(`davex-backend-starter écoute sur le port ${env.port} (${env.nodeEnv})`);
});
