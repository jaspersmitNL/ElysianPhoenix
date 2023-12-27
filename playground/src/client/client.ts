import { Socket } from "phoenix";

const socket = new Socket("", {
  params: { token: "" },
});

socket.onOpen(() => {
  console.log("Socket opened");

  const channel = socket.channel("room:lobby", {});

  channel
    .join()
    .receive("ok", (resp) => {
      console.log("Joined successfully:", resp);

      channel.on("alert", (message) => {
        console.log("alert: ", message);
      });

      channel.push("hello", { body: "world" });
    })
    .receive("error", (resp) => {
      console.log("Unable to join:", resp);
    });
});

socket.connect();
