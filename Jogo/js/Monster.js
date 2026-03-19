'use strict';

class Monster {
    #id;
    #name;
    #shout;
    #strength;
    #hp;
    #maxHp;
    #dead;
    #normalImg;
    #hurtImg;
    #deadImg;

    constructor(config) {
        this.#id        = config.id;
        this.#name      = config.name;
        this.#shout     = config.shout;
        this.#strength  = config.strength;
        this.#hp        = config.hp;
        this.#maxHp     = config.hp;
        this.#dead      = false;
        this.#normalImg = config.normalImg;
        this.#hurtImg   = config.hurtImg;
        this.#deadImg   = config.deadImg;

        AudioManager.instance().register(config.id, config.hurtSound, config.deathSound);
    }

    /* ── Factory Pattern ── */
    static create(config) {
        return new Monster(config);
    }

    get id()        { return this.#id;        }
    get name()      { return this.#name;      }
    get shout()     { return this.#shout;     }
    get strength()  { return this.#strength;  }
    get hp()        { return this.#hp;        }
    get maxHp()     { return this.#maxHp;     }
    get dead()      { return this.#dead;      }
    get normalImg() { return this.#normalImg; }
    get hurtImg()   { return this.#hurtImg;   }
    get deadImg()   { return this.#deadImg;   }

    hpPercent() {
        return (this.#hp / this.#maxHp) * 100;
    }

    /* Receives damage from the player */
    takeDamage(damage) {
        if (this.#dead) return 0;
        const actual = Math.max(1, damage - Math.floor(Math.random() * 6));
        this.#hp = Math.max(0, this.#hp - actual);
        if (this.#hp === 0) {
            this.#dead = true;
            AudioManager.instance().playDeath(this.#id);
        } else {
            AudioManager.instance().playHurt(this.#id);
        }
        return actual;
    }

    /* Resets the monster to its initial state */
    reset() {
        this.#hp   = this.#maxHp;
        this.#dead = false;
    }

    /* Attacks the player — triggered by the "Recebe Ataque" button */
    attackPlayer(player) {
        if (this.#dead) return 0;
        const damage = this.#strength + Math.floor(Math.random() * 10);
        return player.takeDamage(damage);
    }
}