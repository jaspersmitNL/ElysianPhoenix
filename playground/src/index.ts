import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";
import Elysia from "elysia";
import { ChannelRegistry, elysianPhoenix } from "elysian-phoenix";
import esbuild from "esbuild";
import { RoomChannel } from "./room";

const app = new Elysia();
app.use(
  staticPlugin({
    prefix: "/",
    alwaysStatic: false,
  })
);
app.use(html());

app.use(
  elysianPhoenix({
    path: "/websocket",
    registry: new ChannelRegistry().register("room:lobby", new RoomChannel()),

    onOpen: (ws) => {
      return true;
    },
    onMessage: (ws, data) => {
      return true;
    },
  })
);

app.get(
  "/",
  () => `
<html lang='en'>
    <head>
        <title>Hello World</title>
        <script src="/client/client.js" type="module"></script>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`
);

app.listen(3000, () => console.log("Listening on http://localhost:3000"));

async function buildClient() {
  let ctx = await esbuild.context({
    entryPoints: [import.meta.dir + "/client/client.ts"],
    bundle: true,
    outfile: "./public/client/client.js",
    platform: "browser",
    target: "es2017",
    sourcemap: true,
  });

  ctx.watch();
}

buildClient();
