'use strict';

class Player {
    static #instance = null;

    constructor() {
        this.name      = 'Jogador';
        this.hp        = 200;
        this.maxHp     = 200;
        this.dead      = false;
        this.normalImg = 'img/player.png';
        this.hurtImg   = 'img/playerHurt.png';
        this.deadImg   = 'img/playerDead.jfif';

        AudioManager.instance().register(
            'player',
            'sound/playerHurt.mp3',
            'sound/playerDeath.mp3'
        );
    }

    /* ── Singleton Pattern ── */
    static instance() {
        if (!Player.#instance) {
            Player.#instance = new Player();
        }
        return Player.#instance;
    }

    hpPercent() {
        return (this.hp / this.maxHp) * 100;
    }

    takeDamage(damage) {
        if (this.dead) return 0;

        const actual = Math.max(1, damage - Math.floor(Math.random() * 5));
        this.hp = Math.max(0, this.hp - actual);

        if (this.hp === 0) {
            this.dead = true;
            AudioManager.instance().playDeath('player');
            this.#showImage(this.deadImg);
            setTimeout(() => this.revive(), 800);
        } else {
            AudioManager.instance().playHurt('player');
            /* Show hurt image, then always reset to normal regardless of HP% */
            this.#showImage(this.hurtImg);
            setTimeout(() => {
                if (!this.dead) this.#showImage(this.normalImg);
            }, 500);
        }

        return actual;
    }

    revive() {
        this.hp   = this.maxHp;
        this.dead = false;
        AudioManager.instance().playRevive();
        this.#showImage(this.normalImg);
        updatePlayerUI();   /* updates HP bar in index.js */
    }

    /* ── Private: directly sets the image src ── */
    #showImage(src) {
        const img = document.getElementById('img-jogador');
        if (img) img.src = src;
    }
}