import { isNullOrEmpty } from "./parsers.js";
import { icons } from "../data/images.js";

const EXTERNAL_LINK_ICON = '<svg class="about-glass-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

const ACTIVITY_TYPE_LABELS = {
    0: 'Playing',
    1: 'Streaming',
    2: 'Listening to',
    3: 'Watching',
    4: 'Custom',
    5: 'Competing in',
};

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

    /**
     * Returns { imageUrl, description, subtitle?, link? } for the current activity, or null if none.
     * subtitle = details trimmed to one line (e.g. song name for Listening). link = activity URL when present.
     */
    GetActivityDisplay() {
        if (this.IsListeningToSpotify()) {
            const spotifyData = this.data['spotify'];
            const imageUrl = spotifyData['album_art_url'] || icons.spotify;
            const description = 'Listening to';
            const subtitle = `${spotifyData['artist']} – ${spotifyData['song']}`;
            const link = spotifyData['track_id'] ? `https://open.spotify.com/track/${spotifyData['track_id']}` : null;
            return { imageUrl, description, subtitle, link };
        }

        const activities = this.data['activities'];
        if (isNullOrEmpty(activities) || !Array.isArray(activities) || activities.length === 0) return null;

        const activity = activities[0];
        const type = typeof activity['type'] === 'number' ? activity['type'] : 0;
        const name = activity['name'] || 'Something';
        const state = activity['state'];
        const details = activity['details'];
        const label = ACTIVITY_TYPE_LABELS[type] ?? 'Playing';
        let description;
        let subtitle = null;

        if (type === 4) {
            description = state || name;
        } else if (type === 1 && (details || state)) {
            description = `${label} ${details || state}`;
        } else {
            description = type === 2 ? `${label} ${name}` : `${label} ${name}`;
            if (type === 2 && details) subtitle = TrimWrap(details);
        }
        if (subtitle === null && details && type !== 4 && type !== 1) subtitle = TrimWrap(details);

        let imageUrl = ResolveActivityImageUrl(activity);
        // fallback
        if (!imageUrl) imageUrl = icons.unknown_app;
        const link = ResolveActivityLink(activity, type, imageUrl) || activity['url'] || ExtractUrlFromText(details) || ExtractUrlFromText(state) || null;
        return { imageUrl, description, subtitle, link };
    }

    InitializeDiscord() {
        document.getElementById('status-dot').classList.add(this.GetDiscordStatus());
    }

    /** Renders about-glass: either default text or Discord activity (image + description). */
    InitializeAboutGlass(defaultText = 'Creating games and tiny universes 🍂') {
        const glassElement = document.getElementById('about-glass');
        if (!glassElement) return;
        const activity = this.GetActivityDisplay();
        if (!activity) {
            glassElement.innerHTML = `<p>${defaultText}</p>`;
            return;
        }

        const subtitleHtml = activity.subtitle
            ? `<span class="about-glass-activity-subtitle">${EscapeHtml(activity.subtitle)}</span>`
            : '';

        const linkHtml = activity.link
            ? `<a class="about-glass-activity-link" href="${EscapeHtml(activity.link)}" target="_blank" rel="noopener noreferrer" aria-label="Open link">${EXTERNAL_LINK_ICON}</a>`
            : `<span class="about-glass-activity-link about-glass-activity-link--no-link" aria-hidden="true">${EXTERNAL_LINK_ICON}</span>`;

            glassElement.innerHTML = `
            <div class="about-glass-activity">
                <img class="about-glass-activity-img" src="${activity.imageUrl}" alt="" />
                <div class="about-glass-activity-body">
                    <span class="about-glass-activity-text">${EscapeHtml(activity.description)}</span>
                    ${subtitleHtml}
                </div>
                ${linkHtml}
            </div>
        `;
    }
}

function EscapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

const TRIM_MAX_LENGTH = 60;
function TrimWrap(str) {
    if (typeof str !== 'string') return '';
    const oneLine = str.replace(/\s+/g, ' ').trim();
    return oneLine.length > TRIM_MAX_LENGTH ? oneLine.slice(0, TRIM_MAX_LENGTH - 1) + '…' : oneLine;
}

// extract first full URL (http or https) from a string
function ExtractUrlFromText(text) {
    if (typeof text !== 'string') return null;
    const match = text.match(/https?:\/\/[^\s"'<>]+/);
    return match ? match[0].replace(/[)\]\s"']+$/, '') : null;
}

// extract yt vid id from i.ytimg.com/vi/VIDEO_ID/... or youtube.com/watch?v=VIDEO_ID or even youtu.be/VIDEO_ID
function ExtractYoutubeVideoId(url) {
    if (typeof url !== 'string') return null;
    const m = url.match(/(?:ytimg\.com\/vi\/|youtube\.com\/watch\?v=|youtu\.be\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
}

// prefer spotify/yt music link: act.url, URL in details/state, or from YT thumbnail when Listening
function ResolveActivityLink(activity, type, imageUrl) {
    const url = activity['url'];
    if (url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('spotify.com'))) return url;
    const fromDetails = ExtractUrlFromText(activity['details']);
    if (fromDetails && (fromDetails.includes('youtube') || fromDetails.includes('spotify'))) return fromDetails;
    const fromState = ExtractUrlFromText(activity['state']);
    if (fromState && (fromState.includes('youtube') || fromState.includes('spotify'))) return fromState;
    if (type === 2 && imageUrl) {
        const videoId = ExtractYoutubeVideoId(imageUrl);
        if (videoId) return `https://music.youtube.com/watch?v=${videoId}`;
    }
    return null;
}

/**
 * Resolve activity image URL: from details/state (if contains http...), or from assets.
 * Handles mp:external/.../https/domain/path (e.g. YouTube Music) -> https://domain/path.
 */
function ResolveActivityImageUrl(activity) {
    const details = activity['details'];
    const state = activity['state'];
    const urlFromDetails = ExtractUrlFromText(details);
    if (urlFromDetails) return urlFromDetails;
    const urlFromState = ExtractUrlFromText(state);
    if (urlFromState) return urlFromState;

    const assets = activity['assets'];
    const appId = activity['application_id'];
    const large = assets && assets['large_image'];
    const small = assets && assets['small_image'];
    const key = large || small;
    if (typeof key !== 'string') return null;

    if (key.startsWith('http://') || key.startsWith('https://')) return key;

    // e.g. mp:external/.../https/i.ytimg.com/vi/xxx/hq720.jpg -> https://i.ytimg.com/vi/xxx/hq720.jpg
    const httpsIdx = key.indexOf('https/');
    if (httpsIdx !== -1) {
        const path = key.slice(httpsIdx + 6); // after "https/"
        return 'https://' + path;
    }
    const httpIdx = key.indexOf('http/');
    if (httpIdx !== -1) {
        const path = key.slice(httpIdx + 5);
        return 'http://' + path;
    }

    if (appId && key) return `https://cdn.discordapp.com/app-icons/${appId}/${key}.png`;
    return null;
}