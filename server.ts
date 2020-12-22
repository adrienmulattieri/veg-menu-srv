import * as log from "https://deno.land/std@0.76.0/log/mod.ts";

import { initRabbit } from "./rabbitmq/index.ts";
import { initAlgolia } from "./algolia/index.ts";
import { initRedis } from "./redis/index.ts";
import { initHttp } from "./http/index.ts";

const { PORT } = Deno.env.toObject();

Promise.all([initHttp(), initRedis()])
  .then(([app]) => {
    app.addEventListener("listen", ({ hostname, port, secure }) => {
      log.info(
        `Listening on: ${secure ? "https://" : "http://"}${hostname ??
          "localhost"}:${port}`,
      );
    });
    app.listen({ port: +PORT || 3000 });
  })
  .catch((error) => {
    log.error(error);
    log.error(`Could not init server`);
  });
