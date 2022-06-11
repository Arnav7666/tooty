import { client } from "..";
import { Event } from "../structures/Event";
import { mkdirSync, readdirSync } from "fs";
import { MessageActionRow, MessageButton, TextChannel } from "discord.js";
import Jsoning from "jsoning";

export default new Event("ready", () => {
  if (!readdirSync("src").includes("events")) {
    mkdirSync("src/events");
  }
  setInterval(() => {
    const events = readdirSync("src/events").filter(
      (file) =>
        !new Jsoning(`src/events/${file}`).get("sent") &&
        new Jsoning(`src/events/${file}`).get("starts_at") < Date.now()
    );
    events.forEach(async (event) => {
      new Jsoning(`src/events/${event}`).set("sent", true);
      const channel = (await client.channels.fetch(
        new Jsoning("settings.json").get("channel")
      )) as TextChannel;
      channel
        .send({
          content: `Attendance for event \`${
            event.split(".")[0]
          }\` has started, click on the button below to mark your presence`,
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId(`${event.split(".")[0]}`)
                .setEmoji(new Jsoning("settings.json").get("emoji"))
            ),
          ],
        })
        .then((message) => {
          setTimeout(() => {
            if (!readdirSync("src/events").includes(event)) return;
            new Jsoning(`src/events/${event}`).set("ended", true);
            message.edit({
              content: "Attendance ended.",
              components: [
                new MessageActionRow().addComponents(
                  message.components[0].components[0].setDisabled(true)
                ),
              ],
            });
          }, new Jsoning(`src/events/${event}`).get("ends_in"));
        });
    });
  }, 1000);
  return console.log("Bot is online now");
});
