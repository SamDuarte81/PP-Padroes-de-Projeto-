'use strict';

class AudioManager {
    static #instance = null;

    constructor() {
        this.hurtAudios  = {};
        this.deathAudios = {};
        this.reviveAudio = new Audio('sound/playerHurt.mp3');
    }

    static instance() {
        if (!AudioManager.#instance) {
            AudioManager.#instance = new AudioManager();
        }
        return AudioManager.#instance;
    }

    register(id, hurtSrc, deathSrc) {
        this.hurtAudios[id]  = new Audio(hurtSrc);
        this.deathAudios[id] = new Audio(deathSrc);
    }

    playHurt(id) {
        const audio = this.hurtAudios[id];
        if (!audio) return;
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    playDeath(id) {
        const audio = this.deathAudios[id];
        if (!audio) return;
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    playRevive() {
        this.reviveAudio.currentTime = 0;
        this.reviveAudio.play().catch(() => {});
    }
}