import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  GuildMember,
} from "discord.js";
import { Client } from "./Client";

export interface Interaction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: Client;
  interaction: Interaction;
}

type RunFunction = (options: RunOptions) => any;

export type CommandOptions = {
  run: RunFunction;
} & ChatInputApplicationCommandData;

export class Command {
  constructor(options: CommandOptions) {
    Object.assign(this, options);
  }
}
