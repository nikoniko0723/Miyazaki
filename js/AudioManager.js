class AudioManager {
    constructor() {
        this.bgmAudio = new Audio();
        this.bgmAudio.loop = true;
        this.currentBgm = null;
        this.isMuted = false;
        this.maxVolume = 0.8; // default volume
        this.bgmAudio.volume = this.maxVolume;
        
        this.seAudio = new Audio();
        this.seAudio.volume = this.maxVolume;
    }

    playBGM(filename) {
        if (this.isMuted) return;
        
        const newSrc = 'music/' + filename;
        
        // If same track is already playing, do nothing
        if (this.currentBgm === newSrc && !this.bgmAudio.paused) {
            return;
        }

        // Simple fade out -> fade in
        if (!this.bgmAudio.paused && this.bgmAudio.src) {
            this.fadeOut(() => {
                this._startBGM(newSrc);
            });
        } else {
            this._startBGM(newSrc);
        }
    }

    _startBGM(src) {
        this.bgmAudio.src = src;
        this.bgmAudio.volume = 0;
        this.bgmAudio.play().then(() => {
            this.fadeIn();
            this.currentBgm = src;
        }).catch(e => {
            console.log("BGM Play failed (interaction required?):", e);
        });
    }

    fadeOut(callback) {
        const step = this.bgmAudio.volume / 10;
        const fadeAudio = setInterval(() => {
            if (this.bgmAudio.volume > step) {
                this.bgmAudio.volume -= step;
            } else {
                clearInterval(fadeAudio);
                this.bgmAudio.pause();
                this.bgmAudio.volume = this.maxVolume;
                if (callback) callback();
            }
        }, 50);
    }

    fadeIn() {
        this.bgmAudio.volume = 0;
        const step = this.maxVolume / 10;
        const fadeAudio = setInterval(() => {
            if (this.bgmAudio.volume + step < this.maxVolume) {
                this.bgmAudio.volume += step;
            } else {
                this.bgmAudio.volume = this.maxVolume;
                clearInterval(fadeAudio);
            }
        }, 100);
    }

    setVolume(vol) {
        this.maxVolume = vol;
        this.bgmAudio.volume = vol;
        this.seAudio.volume = vol;
    }

    playSE(filename) {
        if (this.isMuted) return;
        this.seAudio.src = 'music/' + filename;
        this.seAudio.play().catch(e => console.log("SE Play failed", e));
    }
}

// Global instance
window.audioManager = new AudioManager();
