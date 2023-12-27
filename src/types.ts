import { ElysiaWS } from "elysia/ws";
import { ChannelRegistry } from "./registry";

export type WS = ElysiaWS<any>;

export type ElysianPhoenixOptions = {
  path: string;
  registry: ChannelRegistry;

  //TODO: Figure out the generic type for this
  onOpen: (ws: WS) => boolean;
  onMessage: (ws: WS, data: any) => boolean;
};

export type Status = "noreply" | "ok" | "error";

export type JoinResponse = {
  status: Exclude<Status, "noreply">;
  response?: any;
};

export type MessageResponse = {
  status: Status;
  response?: any;
};

export enum PhoenixProtocol {
  joinReference = 0,
  messageReference,
  topic,
  event,
  payload,
}

export type PhoenixMessage<T> = [
  joinReference: string | null,
  messageReference: string | null,
  topic: string,
  event: string,
  payload: T
];
