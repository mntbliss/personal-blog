import MintyConsole from "../debug/minty_console.js";
import { isNullOrEmpty } from "../helpers/parsers.js";

export default class MintyPlayer {
  id = '';
  buttonId = '';

  player = {};
  mutedPlayer = {};
  playButton = {};

  state = false;

  constructor(playerId, buttonId) {
    this.id = playerId;
    this.buttonId = buttonId;

    document.addEventListener('DOMContentLoaded', () => {
      this.player = document.getElementById(playerId);
      this.mutedPlayer = document.getElementById(`${playerId}-muted`);
      this.playButton = document.getElementById(buttonId)
    });
  }

  Play() {
      if(isNullOrEmpty(this.player)) {
        MintyConsole.Debug('Player was null on play', false);
        return;
      }

      let state = this.player.paused;

      if(this.player.paused) {
        this.player.play();
        this.player.style.display = 'block';
        this.player.currentTime = this.mutedPlayer.currentTime;
        this.mutedPlayer.style.display = 'none';
        this.playButton.classList.add('is-playing-music');
      }
      else {
        this.player.pause();
        this.mutedPlayer.style.display = 'block';
        this.mutedPlayer.currentTime = this.player.currentTime;
        this.player.style.display = 'none';
        this.playButton.classList.remove('is-playing-music');
      }

      this.player.volume = 0.1; //bruh whoever sets it to 1 by default
      MintyConsole.Debug(`Player is now ${this.player.paused ? 'muted' : 'playing with volume'}`);
    }

    IsPlaying() { 
      if(isNullOrEmpty(this.player)) return false;
      return this.mutedPlayer.paused;
    };
}