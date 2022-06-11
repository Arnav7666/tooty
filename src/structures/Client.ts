import Discord from "discord.js";
import { CommandOptions } from "./Command";
import { Event } from "./Event";
import { readdirSync } from "fs";

export class Client extends Discord.Client {
  commands: Discord.Collection<string, CommandOptions> =
    new Discord.Collection();

  constructor() {
    super({
      intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
    });
  }

  private async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async build() {
    this.login(
      "NzYxODQ5MTE0ODAzMDQ0MzYy.GU96Rq.pgCzUYCTfpTsuQUDYl__XyBpVV2IWB8N1oHzpg"
    );
    const commands: Discord.ApplicationCommandDataResolvable[] = [];
    const commandFiles = readdirSync(`${process.cwd()}/src/commands`);
    commandFiles.forEach(async (file) => {
      const command: CommandOptions = await this.importFile(
        `../commands/${file}`
      );
      if (!command.name) return;
      this.commands.set(command.name, command);
      commands.push(command);
    });
    this.on("ready", () => {
      this.application.commands.set(commands);
    });
    const eventFiles = readdirSync(`${process.cwd()}/src/listeners`);
    eventFiles.forEach(async (file) => {
      const { event, run }: Event<keyof Discord.ClientEvents> =
        await this.importFile(`../listeners/${file}`);
      this.on(event, run);
    });
  }
}
