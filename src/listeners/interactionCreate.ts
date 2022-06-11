import { Interaction } from "../structures/Command";
import { client } from "..";
import { Event } from "../structures/Event";
import Jsoning from "jsoning";
import { readdirSync } from "fs";
import { GuildMemberRoleManager, MessageEmbed } from "discord.js";

export default new Event("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    return command.run({ client, interaction: interaction as Interaction });
  }
  if (interaction.isButton()) {
    if (
      readdirSync(`${process.cwd()}/src/events`).includes(
        `${interaction.customId}.json`
      )
    ) {
      if (
        new Jsoning(`src/events/${interaction.customId}.json`)
          .get("users")
          .some(
            (x) =>
              x[0] === interaction.user.tag &&
              x[1] === `’${interaction.user.id}`
          )
      ) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setDescription(`:x: Your attendance is already marked`),
          ],
        });
      }
      if (
        !(interaction.member.roles as GuildMemberRoleManager).cache.has(
          new Jsoning("settings.json").get("roles")[0]
        ) &&
        !(interaction.member.roles as GuildMemberRoleManager).cache.has(
          new Jsoning("settings.json").get("roles")[1]
        )
      ) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setDescription(
                `:x: You don't have any of the attendance roles (<@&${
                  new Jsoning("settings.json").get("roles")[0]
                }> and <@&${new Jsoning("settings.json").get("roles")[1]}>)`
              ),
          ],
        });
      }
      new Jsoning(`src/events/${interaction.customId}.json`).push("users", [
        interaction.user.tag,
        `’${interaction.user.id}`,
      ]);
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(
              `:white_check_mark: Your attendance has been successfully marked`
            ),
        ],
      });
    } else {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(`:x: This event has been cancelled`),
        ],
      });
    }
  }
});
