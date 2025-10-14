import DiscordHelper from "./helpers/discord-helper.js";
import { isNullOrEmpty } from "./helpers/parsers.js";
import Discord from "./utility/discord-client-parser.js";
import MintyPlayer from "./utility/minty-player.js";

const mintyPlayer = new MintyPlayer('bg-video', 'music-toggle');
const id = '189184578588508161';
const discord = new Discord(id);

let discordHelper = null;

discord.Parse().then((value) => {
    if(isNullOrEmpty(value)) {
        console.log(`❤️ Could not retrieve data about discord.`);
    } 
    else discordHelper = new DiscordHelper(value); 
}).finally(() => { if(!isNullOrEmpty(discordHelper)) discordHelper.InitializeDiscord(); });