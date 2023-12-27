import { Channel } from ".";

export class ChannelRegistry {
  #channels: Map<string, Channel> = new Map();

  register(name: string, channel: Channel): ChannelRegistry {
    this.#channels.set(name, channel);
    return this;
  }

  get(name: string): Channel | undefined {
    for (const [key, value] of this.#channels.entries()) {
      if (key === name) {
        return value;
      }

      if (key.endsWith("*")) {
        const prefix = key.slice(0, -1);
        if (name.startsWith(prefix)) {
          return value;
        }
      }
    }

    return undefined;
  }
}
