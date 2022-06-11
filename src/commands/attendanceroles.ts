import { Command } from "../structures/Command";
import { MessageEmbed } from "discord.js";
import Jsoning from "jsoning";

export default new Command({
  name: "attendanceroles",
  description: "All attendance roles commands",
  options: [
    {
      name: "set",
      description: "To set the attendance roles",
      type: 1,
      options: [
        {
          name: "role1",
          description: "The first role",
          type: 8,
          required: true,
        },
        {
          name: "role2",
          description: "The second role",
          type: 8,
          required: true,
        },
      ],
    },
    {
      name: "view",
      description: "To view the current attendance roles",
      type: 1,
    },
  ],
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "set") {
      const role1 = interaction.options.getRole("role1");
      const role2 = interaction.options.getRole("role2");
      if (
        ["@everyone", "@here"].includes(role1.name) ||
        ["@everyone", "@here"].includes(role2.name) ||
        role1.managed ||
        role2.managed
      ) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setDescription(`:x: One of the given roles is integrated`),
          ],
        });
      }
      new Jsoning("settings.json").set("roles", [role1.id, role2.id]);
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(
              `:white_check_mark: Successfully set the attendance roles to ${role1} and ${role2}`
            ),
        ],
      });
    }
    if (subcommand === "view") {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed().setColor("#2f3136").setDescription(
            `${new Jsoning("settings.json")
              .get("roles")
              .map((role: string) => `<@&${role}>`)
              .join(" and ")} are the current attendance roles`
          ),
        ],
      });
    }
  },
});
