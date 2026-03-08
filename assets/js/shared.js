import { antiEarRapeCoefficient } from "./data/about.js";
import { consoleBase } from "./data/images.js";
import { AddClassById, IsElementHidden, isNullOrEmpty, Peek, RandomInt, SetCurrentTime, Show, ShowCurrent, ShowWindow, SubscribeOnClick } from "./helpers/parsers.js";
import MintyPlayer from "./utility/minty-player.js";

const showTerminalAfterMS = 200;
const showEachTerminalTextDelayMS = 300;
const showBootAfterMS = 500;
const showLoadingForMS = 2400;

//🏁 Boot up setup:
// 1. i need to show terminal
setTimeout(ShowTerminal, showTerminalAfterMS);

export function ShowTerminal() {
    Show('terminal', true)

    //2. on click on terminal show boot ui
    document.getElementById('terminal').onclick = function(element) {
        element.target.onclick = undefined; //unsub
        AddClassById('pc-background', 'anim-element')
        AddClassById('pc-background', 'scale-in')
        Show('terminal', false)
        setTimeout(() => {
            ShowBootUI();
        }, showBootAfterMS);
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
    }, showEachTerminalTextDelayMS)
}

export function PlayAudio(url) {
    const audio = new Audio(url);
    audio.volume = 0.1;
    audio.play();
}

// 3. show bootup image, play sound
export function ShowBootUI() {
    Show('boot-background', true);
    document.getElementById('boot-background').play();
    setTimeout(() => PlayAudio('./assets/sounds/glitch2.mp3'), 1500);
    setTimeout(() => PlayAudio('./assets/sounds/glitch4.mp3'), 2200);
    setTimeout(() => {
        Show('terminal', false);
        ShowMainUI();
        PlayAudio('./assets/sounds/startup.mp3');
        setTimeout(() => { AddClassById('boot-background', 'fade-out'); }, 1000);
    }, showLoadingForMS);
}

// 4. show main ui
export function ShowMainUI() {
    Show('terminal', false);
    Show('bg-video', true);
    Show('top-panel', true);
    Show('home-grid', true);
}

//🍰 Timer setup:
SetCurrentTime();
setInterval(SetCurrentTime, 1000);

document.getElementById('volume-button-topbar').onclick = function(event) {
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
// Peek(consoleBase, 15, 'What r u lookin at?');

SubscribeOnClick('window-about-button', () => {
    document.getElementById('avatar').src = `./assets/images/broken_avatar.png`
    
    ShowWindow(document.getElementById('window-about'));
    setTimeout(() => {
        PlayAudio('./assets/sounds/glitch5.mp3')
        document.getElementById('avatar').src = `./assets/images/avatar${RandomInt(1, 12)}.jpg`
    }, 1000)
})