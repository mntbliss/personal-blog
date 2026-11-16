import DiscordHelper from "./helpers/discord-helper.js";
import { isNullOrEmpty } from "./helpers/parsers.js";
import Discord from "./utility/discord-client-parser.js";
// import MintyPlayer from "./utility/minty-player.js";

// const mintyPlayer = new MintyPlayer('bg-video', 'music-toggle');
const id = '189184578588508161';
const discord = new Discord(id);
let discordHelper = null;



const DISCORD_REFRESH_MS = 5 * 60 * 1000;
const INTRO_SETTLE_MS = 4000;

function applyDiscordPresence(data) {
    if (isNullOrEmpty(data)) return;
    discordHelper = new DiscordHelper(data);
    discordHelper.InitializeDiscord();
    discordHelper.InitializeAboutGlass();
    discordHelper.InitializeLeaftubeCard();
}

async function refreshDiscordPresence() {
    try {
        const value = await discord.Parse();
        if (isNullOrEmpty(value)) {
            console.log(`❤️ Could not retrieve data about discord.`);
            return;
        }
        applyDiscordPresence(value);
    } catch (err) {
        console.log(`❤️ Discord refresh failed.`, err);
    }
}

function startDiscordPresenceLoop() {
    setTimeout(() => {
        refreshDiscordPresence();
        setInterval(refreshDiscordPresence, DISCORD_REFRESH_MS);
    }, INTRO_SETTLE_MS);
}

startDiscordPresenceLoop();

setTimeout(() => {
    import("./debug/asuka-message.js")
        .then((m) => m.showAsukaMessage())
        .catch(() => {});
}, INTRO_SETTLE_MS);
