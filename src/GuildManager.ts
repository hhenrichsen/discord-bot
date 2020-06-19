import { GuildSettings, GuildModel } from "./models/Guild";
import {Collection} from "discord.js";

class GuildManager {
    public readonly guilds: Collection<string, GuildSettings> = new Collection<string, GuildSettings>();
}

const guildManager = new GuildManager();
export default guildManager;