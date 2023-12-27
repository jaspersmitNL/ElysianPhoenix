import Elysia from "elysia";
import { Logger } from "./logger";
import { ChannelRegistry } from "./registry";
import { PhoenixMessage, PhoenixProtocol, WS } from "./types";

const logger = new Logger("ElysianPhoenix");

function newReply(message: PhoenixMessage<any>, payload: any) {
  return [
    message[PhoenixProtocol.joinReference],
    message[PhoenixProtocol.messageReference],
    message[PhoenixProtocol.topic],
    "phx_reply",
    payload,
  ];
}

function handleJoin(
  registry: ChannelRegistry,
  ws: WS,
  message: PhoenixMessage<any>
) {
  const topic = message[PhoenixProtocol.topic];
  const payload = message[PhoenixProtocol.payload];
  const channel = registry.get(topic);

  if (!channel) {
    logger.error(`Channel ${topic} not found`);
    ws.send(
      JSON.stringify(
        newReply(message, {
          status: "error",
          response: `Channel ${topic} not found`,
        })
      )
    );
    return;
  }

  const { status, response } = channel.onJoin(topic, payload, ws);

  ws.send(JSON.stringify(newReply(message, { status, response })));
}

function handleLeave(
  registry: ChannelRegistry,
  ws: WS,
  message: PhoenixMessage<any>
) {
  const topic = message[PhoenixProtocol.topic];
  const channel = registry.get(topic);
  if (!channel) {
    logger.error(`Channel ${topic} not found`);
    return;
  }
  channel.onLeave(topic, ws);
}

function handleMessage(
  registry: ChannelRegistry,
  ws: WS,
  message: PhoenixMessage<any>
) {
  const event = message[PhoenixProtocol.event];
  const topic = message[PhoenixProtocol.topic];

  const payload = message[PhoenixProtocol.payload];
  const channel = registry.get(topic)!;

  if (!channel) {
    logger.error(`Channel ${topic} not found`);
    return;
  }

  const { status, response } = channel.onMessage(topic, event, payload, ws);

  if (status === "noreply") {
    return;
  }

  ws.send(JSON.stringify(newReply(message, { status, response })));
}

function handleHeartbeat(ws: WS, message: PhoenixMessage<any>) {
  ws.send(
    JSON.stringify([
      null,
      message[PhoenixProtocol.messageReference],
      "phoenix",
      "phx_reply",
      {
        response: {},
        status: "ok",
      },
    ])
  );
}

export function elysianPhoenix({
  path = "/websocket",
  registry = new ChannelRegistry(),
  onOpen = (ws: WS) => true,
  onMessage = (ws: WS, data: any) => true,
}: any): Elysia {
  const app = new Elysia();

  app.ws(path, {
    open(ws) {
      if (!onOpen(ws as WS)) {
        return;
      }
    },
    message(ws, raw) {
      const message: PhoenixMessage<any> = JSON.parse(
        (raw as string).toString()
      );

      if (!onMessage(ws as WS, message)) {
        return;
      }

      const event = message[PhoenixProtocol.event];

      //check if message is a array and has 5 elements
      if (Array.isArray(message) && message.length === 5) {
        switch (event) {
          case "phx_join":
            handleJoin(registry, ws as WS, message);
            break;

          case "phx_leave":
            handleLeave(registry, ws as WS, message);
            break;

          case "heartbeat":
            handleHeartbeat(ws as WS, message);
            break;

          default:
            handleMessage(registry, ws as WS, message);
            break;
        }
      }
    },
  });

  return app;
}
