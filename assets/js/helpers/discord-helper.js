import { isNullOrEmpty } from "./parsers.js";

export default class DiscordHelper {
    data = {};

    constructor(dataRef) {
        this.data = dataRef;
    }

    GetDiscordName() {
        if(isNullOrEmpty(this.data['discord_user'])) return 'mntbliss 🌿';
        else return this.data['discord_user']['display_name'];
    }

    GetDiscordStatus() {
        if(isNullOrEmpty(this.data['discord_status'])) return 'offline';
        else return this.data['discord_status'];
    }

    GetDiscordAvatar() {
        if(isNullOrEmpty(this.data['discord_user'])) return images['base_avatar'];
        else return `https://cdn.discordapp.com/avatars/${this.data['discord_user']['id']}/${this.data['discord_user']['avatar']}.gif`;
    }

    GetDiscordActivity() {
        if(this.IsListeningToSpotify()) return `${this.data['spotify']['artist']} - ${this.data['spotify']['song']}`;
        else return 'Playing Visual Studio Code';
    }

    GetDiscordStatusCSS() { 
        return `fir-imageover-color status ${this.GetDiscordStatus()}`; }

    IsListeningToSpotify() { return !isNullOrEmpty(this.data['spotify']); }

    InitializeDiscord() {
        console.log('InitializeDiscord')
        document.getElementById('status-dot').classList.add(this.GetDiscordStatus());
    }
}