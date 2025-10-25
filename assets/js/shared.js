import { antiEarRapeCoefficient } from "./data/about.js";
import { consoleBase } from "./data/images.js";
import DiscordHelper from "./helpers/discord-helper.js";
import { AddClassById, IsElementHidden, isNullOrEmpty, Peek, SetCurrentTime, Show, ShowCurrent } from "./helpers/parsers.js";
import Discord from "./utility/discord-client-parser.js";
import MintyPlayer from "./utility/minty-player.js";

//🏁 Boot up setup:
// 1. i need to show terminal
setTimeout(ShowTerminal, 200);

// 3. show bootup image, play sound
// 4. show main ui

export function ShowTerminal() {
    Show('terminal', true)

    document.getElementById('terminal').onclick = function(element) {
        element.target.onclick = undefined; //unsub
        AddClassById('pc-background', 'anim-element')
        AddClassById('pc-background', 'scale-in')
        Show('terminal', false)
        setTimeout(() => {
            ShowBootUI();
        }, 1000);
    };

    let items = document.getElementsByName('terminal-startup-text');
    let index = 0;

    const intervalId = setInterval(() => {
        if(isNullOrEmpty(items) || items.length <= 0 || index >= items.length) {
            clearInterval(intervalId);
            return;
        }

        ShowCurrent(items[index], true);
        index++;
    }, 300)
}

export function PlayAudio() {
    const audio = new Audio('./assets/sounds/startup.mp3');
    audio.volume = 0.1;
    audio.play();
}

export function ShowBootUI() {
    Show('boot-background', true);
    setTimeout(() => {
        Show('terminal', false);
        ShowMainUI();
        PlayAudio();
        setTimeout(() => { AddClassById('boot-background', 'fade-out'); }, 1000);
    }, 1000);
}

export function ShowMainUI() {
    Show('terminal', false);
    Show('bg-video', true);
    Show('top-panel', true);
}

//🍰 Timer setup:
SetCurrentTime();
setInterval(SetCurrentTime, 1000);

document.getElementById('volume-button-topbar').onclick = function(event) {
    console.log('1213')
    Show('volume-scroll-topbar', IsElementHidden('volume-scroll-topbar') ? true : false);
}

document.getElementById('volume-meter').value = 0;
document.getElementById('volume-meter').oninput = function(event) {
    mintyPlayer.volume = event.target.value / 100 / antiEarRapeCoefficient;
    mintyPlayer.PlaySolo();
    
    document.getElementById('volume-button-text-topbar').innerText = event.target.value + '%';
    document.getElementById('volume-button-image-topbar').src = event.target.value <= 0 ? './assets/images/icons/volume-down.svg' : './assets/images/icons/volume-up.svg';
}

//🍰 Video bg setup:
const mintyPlayer = new MintyPlayer('bg-video', 'music-toggle');

//🍰 Console setup:
Peek(consoleBase, 15, 'What r u lookin at?');


// const id = '189184578588508161';
// const discord = new Discord(id);
// let discordHelper = null;


// discord.Parse().then((value) => {
//     if(isNullOrEmpty(value)) {
//         console.log(`❤️ Could not retrieve data about discord.`);
//     } 
//     else discordHelper = new DiscordHelper(value); 
// }).finally(() => { 
//         if(!isNullOrEmpty(discordHelper)) {
//             discordHelper.InitializeDiscord(); 
//         }
//     });