import { Command } from "../structures/Command";
import { MessageEmbed } from "discord.js";
import { writeFileSync } from "fs";
import Jsoning from "jsoning";

export default new Command({
  name: "attendancechannel",
  description: "All attendance channel commands",
  options: [
    {
      name: "set",
      description: "To set the attendance channel",
      type: 1,
      options: [
        {
          name: "channel",
          description: "Which channel should be the new attendance channel?",
          channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
          type: 7,
          required: true,
        },
      ],
    },
    {
      name: "view",
      description: "To view the current attendance channel",
      type: 1,
    },
  ],
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "set") {
      const channel = interaction.options.getChannel("channel");
      new Jsoning("settings.json").set("channel", channel.id);
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(
              `:white_check_mark: Successfully set the attendance channel to ${channel}`
            ),
        ],
      });
    }
    if (subcommand === "view") {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(
              `<#${new Jsoning("settings.json").get(
                "channel"
              )}> is the current attendance channel`
            ),
        ],
      });
    }
  },
});
