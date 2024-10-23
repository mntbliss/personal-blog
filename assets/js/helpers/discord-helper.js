import { project_info } from "../data/about.js";
import { images } from "../data/images.js";
import { isNullOrEmpty } from "./parsers.js";

export default class DiscordHelper {
    discord = '';
    dataRef = {};

    constructor(discord, dataRef) {
        this.discord = discord;
        this.dataRef = dataRef;
    }

    GetDiscordName() {
        if(isNullOrEmpty(this.dataRef.value['discord_user'])) return project_info['developer'];
        else return this.dataRef.value['discord_user']['display_name'];
    }

    GetDiscordStatus() {
        if(isNullOrEmpty(this.dataRef.value['discord_status'])) return 'offline';
        else return this.dataRef.value['discord_status'];
    }

    GetDiscordAvatar() {
        if(isNullOrEmpty(this.dataRef.value['discord_user'])) return images['base_avatar'];
        else return `https://cdn.discordapp.com/avatars/${this.dataRef.value['discord_user']['id']}/${this.dataRef.value['discord_user']['avatar']}.gif`;
    }

    GetDiscordActivity() {
        if(this.IsListeningToSpotify()) return `${this.dataRef.value['spotify']['artist']} - ${this.dataRef.value['spotify']['song']}`;
        else return 'Playing Visual Studio Code';
    }

    GetDiscordStatusCSS() { 
        return `fir-imageover-color status ${this.GetDiscordStatus()}`; }

    IsListeningToSpotify() { return !isNullOrEmpty(this.dataRef.value['spotify']); }
}