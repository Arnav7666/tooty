import { Command } from "../structures/Command";
import { MessageEmbed } from "discord.js";
import { readdirSync, writeFileSync, unlinkSync } from "fs";
import Jsoning from "jsoning";
import ms from "ms";

export default new Command({
  name: "event",
  description: "All event commands",
  options: [
    {
      name: "cancel",
      description: "Cancel an event",
      type: 1,
      options: [
        {
          name: "event",
          description: "Which event you want to cancel?",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "create",
      description: "Create an event",
      type: 1,
      options: [
        {
          name: "name",
          description: "What should be the name of the event?",
          type: 3,
          required: true,
        },
        {
          name: "starts_at",
          description: "When should the event start?",
          type: 4,
          required: true,
        },
        {
          name: "ends_in",
          description: "In how much minutes should the event end?",
          type: 4,
          required: true,
        },
      ],
    },
    {
      name: "list",
      description: "Get a list of all the events",
      type: 1,
    },
  ],
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "cancel") {
      const event = interaction.options.getString("event") + ".json";
      unlinkSync(`src/events/${event}`);
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(
              `:white_check_mark: Successfully cancelled the event \`${
                event.split(".")[0]
              }\``
            ),
        ],
      });
    }
    if (subcommand === "create") {
      const eventname = interaction.options.getString("name") + ".json";
      if (readdirSync("src/events").includes(eventname)) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("#2f3136")
              .setDescription(":x: An event with this name already exists"),
          ],
        });
      }
      const eventstartsat = interaction.options.getInteger("starts_at");
      const eventendsin = interaction.options.getInteger("ends_in");
      writeFileSync(
        `src/events/${eventname}`,
        JSON.stringify({
          starts_at: eventstartsat * 1000,
          sent: false,
          ends_in: ms(`${eventendsin}m`),
          ended: false,
          users: [],
        })
      );
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(
              `:white_check_mark: Event \`${
                eventname.split(".")[0]
              }\` will be started at <t:${eventstartsat}> and will end in **${ms(
                ms(`${eventendsin}m`),
                { long: true }
              )}**`
            ),
        ],
      });
    }
    if (subcommand === "list") {
      const events = readdirSync("src/events")
        .filter(
          (file) =>
            new Jsoning(`src/events/${file}`).get("starts_at") > Date.now()
        )
        .map(
          (event, index) =>
            `\`${++index}.\` ${event.split(".")[0]}\nStarts at: <t:${
              new Jsoning(`src/events/${event}`).get("starts_at") / 1000
            }>\nEnds in: **${ms(new Jsoning(`src/events/${event}`).get("ends_in"), {
              long: true,
            })}**\n`
        );
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(
              events.length ? events.join("\n") : ":x: There are no events"
            ),
        ],
      });
    }
  },
});
