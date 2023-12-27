import { Channel, JoinResponse, MessageResponse, WS } from "elysian-phoenix";

export class RoomChannel extends Channel {
  onJoin(topic: string, message: any, ws: WS): JoinResponse {
    return { status: "ok", response: {} };
  }
  onMessage(
    topic: string,
    event: string,
    message: any,
    ws: WS
  ): MessageResponse {
    console.log("RoomChannel.onMessage", topic, event, message);

    if (event === "hello") {
      this.send(
        topic,
        "alert",
        "Hello your message was " + JSON.stringify(message),
        ws
      );
    }

    return { status: "ok", response: {} };
  }
}
