import { Command } from "../structures/Command";
import { MessageEmbed } from "discord.js";
import { writeFileSync } from "fs";
import Jsoning from "jsoning";

export default new Command({
  name: "setemoji",
  description: "To set the attendance messages' emoji",
  options: [
    {
      name: "emoji",
      description: "The emoji",
      type: 3,
      required: true,
    },
  ],
  run: async ({ interaction }) => {
    const emoji = interaction.options.getString("emoji");
    new Jsoning("settings.json").set("emoji", emoji);
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor("#2f3136")
          .setDescription(
            `:white_check_mark: Successfully set the attendance messages' emoji to ${emoji}`
          ),
      ],
    });
  },
});
