import { project_info, projects, socials } from "./assets/js/data/about.js";
import { icons, images } from "./assets/js/data/images.js";
import DiscordHelper from "./assets/js/helpers/discord-helper.js";
import Discord from "./assets/js/utility/discord-client-parser.js";
import MintyPlayer from "./assets/js/utility/minty-player.js";
import { ContentMenu } from "./assets/js/ui/content-menu.js";
import ContentHandler from "./assets/js/helpers/content-handler.js";
import MintyConsole from "./assets/js/debug/minty_console.js";
import { isNullOrEmpty } from "./assets/js/helpers/parsers.js";

const discord = new Discord('189184578588508161');
const discordData = Vue.ref({});
const discordHelper = new DiscordHelper(discord, discordData);

const mintyPlayer = new MintyPlayer('preview-vid', 'play-music-button');
const contentMenu = Vue.ref({});
const contentHandler = new ContentHandler();
contentMenu.value = new ContentMenu();

const app = Vue.createApp({
    // NOTE: Better to user func wrappers, more strict and controllable flow (HTML is a mess already anyway 🥺)
    // setup() { discordData, },
    data() {
        return {
            project_info: project_info,
            projects: projects,
            socials: socials,
            images: images,
            icons: icons,
        }
    },
    methods: {
        GetDiscordName() { return discordHelper.GetDiscordName() },
        GetDiscordStatus() { return discordHelper.GetDiscordStatus() },
        GetDiscordAvatar() { return discordHelper.GetDiscordAvatar() },
        GetDiscordActivity() { return discordHelper.GetDiscordActivity() },
        GetDiscordStatusCSS() { return discordHelper.GetDiscordStatusCSS() },

        IsListeningToSpotify() { return discordHelper.IsListeningToSpotify() },
        
        PlayVideo() { mintyPlayer.Play(); },

        OpenPage(index) { contentMenu.value.OpenPage(index); }
    },
    updated() {
        contentHandler.UnlockContent();
        MintyConsole.Debug('Hot-unlock content after reactive render', true);
    },
});

const mounted_app = app.mount('#app'); //mount to div
contentMenu.value.PlaceDefaultContent();

discord.Parse().then((value) => {
    if(isNullOrEmpty(value)) {
        MintyConsole.Error(`Could not retrieve data about discord`);
        contentHandler.UnlockContent();
    } 
    else discordData.value = value; 
}).finally(() => { if(isNullOrEmpty(discordData.value)) contentHandler.UnlockContent() });