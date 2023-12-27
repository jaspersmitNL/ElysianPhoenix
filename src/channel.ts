import { JoinResponse, MessageResponse, WS } from ".";

export abstract class Channel {
  public onJoin(topic: string, message: any, ws: WS): JoinResponse {
    return { status: "ok", response: {} };
  }

  public onMessage(
    topic: string,
    event: string,
    message: any,
    ws: WS
  ): MessageResponse {
    return { status: "ok", response: {} };
  }

  public onLeave(topic: string, ws: WS): void {}

  public send(topic: string, event: string, payload: any, ws: WS) {
    ws.send(
      JSON.stringify([
        null, // join_ref
        null, // ref
        topic, // topic
        event, // event
        payload, // payload
      ])
    );
  }
}
