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

      // document.getElementById('music-toggle').addEventListener('click', () => this.Play());
      document.getElementById('music-toggle').addEventListener('click', () => this.PlaySolo());
    });
    
  }

  Mute() {
    this.player.volume = 0;
    this.player.muted = true;
    this.playButton.classList.remove('is-playing-music');
  }

  Unmute() {
    this.player.volume = 0.1; //bruh whoever sets it to 1 by default is a demon ngl 💀
    this.player.muted = false;
    this.playButton.classList.add('is-playing-music');
  }

  Pause() {
    this.player.pause();
    this.mutedPlayer.style.display = 'block';
    this.mutedPlayer.currentTime = this.player.currentTime;
    this.player.style.display = 'none';
    this.playButton.classList.remove('is-playing-music');
  }

  Unpause() {
    this.player.play();
    this.player.style.display = 'block';
    this.player.currentTime = this.mutedPlayer.currentTime;
    this.mutedPlayer.style.display = 'none';
    this.playButton.classList.add('is-playing-music');
  }

  Play() {
      if(isNullOrEmpty(this.player)) {
        console.log('🍂 Player was null on play');
        return;
      }

      if(this.player.paused) {
        this.Unpause();
      }
      else {
        this.Pause();
      }

      this.player.volume = 0.1; //bruh whoever sets it to 1 by default is a demon ngl 💀
      console.log(`🌿 Player is now ${this.player.paused ? 'muted' : 'playing with volume'}`);
    }

    IsPlaying() { 
      if(isNullOrEmpty(this.player)) return false;
      return this.mutedPlayer.paused;
    };

    PlaySolo() {
        if(isNullOrEmpty(this.player)) {
          console.log('🍂 Player was null on play');
          return;
        }
  
        if(this.player.muted) {
          this.Unmute();
        }
        else {
          this.Mute();
        }
  
        console.log(`🌿 Player is now ${this.player.muted || this.player.paused ? 'muted' : 'playing with volume'}`);
      }
  
      IsPlaying() { 
        if(isNullOrEmpty(this.player)) return false;
        return this.mutedPlayer.paused;
      };
}