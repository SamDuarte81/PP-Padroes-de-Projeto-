'use strict';

/* ── Monster configs (4 enemies) ── */
const MONSTER_CONFIGS = [
    {
        id:         'batman',
        name:       'Batman',
        shout:      '"Eu sou o Batman!"',
        normalImg:  'img/batman.jpg',
        hurtImg:    'img/batmanHurt.jfif',
        deadImg:    'img/batmanDead.jpg',
        hurtSound:  'sound/batmanHurt.mp3',
        deathSound: 'sound/batmanDeath.mp3',
        strength:   14,
        hp:         80
    },
    {
        id:         'invencivel',
        name:       'O Invencível',
        shout:      '"Sou INVENCÍVEL!"',
        normalImg:  'img/mark.jpg',
        hurtImg:    'img/markHurt.webp',   /* FIX: was pointing to mark.jpg (same as normal) */
        deadImg:    'img/markDeath.jpg',
        hurtSound:  'sound/invencivelHurt.mp3',
        deathSound: 'sound/invencivelDeath.mp3',
        strength:   40,
        hp:         200
    },
    {
        id:         'sasuke',
        name:       'Sasuke',
        shout:      '"Chidori!"',
        normalImg:  'img/sasuke.webp',
        hurtImg:    'img/sasukeDano.webp',
        deadImg:    'img/sasukeDead.webp',
        hurtSound:  'sound/sasukeHurt.mp3',
        deathSound: 'sound/sasukeDeath.mp3',
        strength:   28,
        hp:         140
    },
    {
        id:         'yamcha',
        name:       'Yamcha',
        shout:      '"Lobo do Deserto!"',
        normalImg:  'img/yamcha.webp',
        hurtImg:    'img/yamchaDn.webp',
        deadImg:    'img/yamchadead.webp',
        hurtSound:  'sound/yanchaHurt.mp3',
        deathSound: 'sound/yanchaDeath.mp3',
        strength:   20,
        hp:         110
    }
];

let monsters = [];

/* ================================================================
   RENDER — Monster card
   ================================================================ */
function renderMonster(m) {
    const card = document.createElement('div');
    card.className = 'card-monstro';
    card.id        = 'card-' + m.id;

    card.innerHTML = `
        <img id="img-${m.id}" class="img-monstro" src="${m.normalImg}" alt="${m.name}" />
        <div class="nome-monstro">${m.name}</div>
        <div class="atributos">
            ⚔ Força: <strong>${m.strength}</strong>
            &nbsp;|&nbsp;
            💚 HP: <strong>${m.maxHp}</strong>
        </div>

        <div class="hp-container">
            <div class="hp-label">
                <span>HP</span>
                <span id="hp-texto-${m.id}">${m.hp} / ${m.maxHp}</span>
            </div>
            <div class="hp-barra-fundo">
                <div id="hp-fill-${m.id}" class="hp-barra-preenchimento" style="width:100%"></div>
            </div>
        </div>

        <div class="grito" id="grito-${m.id}">${m.shout}</div>

        <div class="botoes-card">
            <button
                class="btn-atacar"
                id="btn-atacar-${m.id}"
                onclick="attackMonster('${m.id}')"
            >⚔ Atacar</button>

            <button
                class="btn-recebe"
                id="btn-recebe-${m.id}"
                onclick="receiveAttackFrom('${m.id}')"
            >🛡 Recebe Ataque</button>
        </div>
    `;

    return card;
}

/* Updates HP bar and text only — image is managed by attackMonster */
function updateMonsterUI(m) {
    const pct  = m.hpPercent();
    const fill = document.getElementById('hp-fill-'  + m.id);
    const txt  = document.getElementById('hp-texto-' + m.id);
    if (!fill) return;

    fill.style.width = pct + '%';
    txt.textContent = m.hp + ' / ' + m.maxHp;
}

/* ── RENDER PLAYER (no buttons) ── */
function renderPlayer() {
    const p    = Player.instance();
    const cont = document.getElementById('arena-jogador');

    cont.innerHTML = `
        <div id="card-jogador">
            <img id="img-jogador" class="img-jogador" src="${p.normalImg}" alt="${p.name}" />
            <div class="jogador-info">
                <div class="jogador-nome">🧑 ${p.name}</div>
                <div class="hp-container">
                    <div class="hp-label">
                        <span>HP</span>
                        <span id="hp-texto-jogador">${p.hp} / ${p.maxHp}</span>
                    </div>
                    <div class="hp-barra-fundo">
                        <div id="hp-fill-jogador" class="hp-barra-preenchimento" style="width:100%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* Updates HP bar and text only — image is managed by Player.takeDamage / Player.revive */
function updatePlayerUI() {
    const p    = Player.instance();
    const pct  = p.hpPercent();
    const fill = document.getElementById('hp-fill-jogador');
    const txt  = document.getElementById('hp-texto-jogador');
    if (!fill) return;

    fill.style.width = pct + '%';
    txt.textContent = p.hp + ' / ' + p.maxHp;
}

/* ================================================================
   ACTIONS
   ================================================================ */

/* "Atacar" button → player attacks that monster */
function attackMonster(id) {
    const m = monsters.find(x => x.id === id);
    if (!m || m.dead) return;

    m.takeDamage(15 + Math.floor(Math.random() * 20));

    const card = document.getElementById('card-' + m.id);
    const img  = document.getElementById('img-'  + m.id);

    /* Show hurt image → reset to normal after 0.8 s */
    img.src = m.hurtImg;
    setTimeout(() => { img.src = m.normalImg; }, 800);

    /* If dead: show dead image briefly, then resurrect */
    if (m.dead) {
        img.src = m.deadImg;
        setTimeout(() => {
            m.reset();
            img.src = m.normalImg;
            updateMonsterUI(m);
        }, 800);
        return;
    }

    updateMonsterUI(m);
}

/* "Recebe Ataque" button → that specific monster attacks the player */
function receiveAttackFrom(id) {
    const m = monsters.find(x => x.id === id);
    if (!m || m.dead) return;

    /* Monster attacks with its own strength + random variation */
    m.attackPlayer(Player.instance());

    updatePlayerUI();
}

/* ── INIT ── */
function startGame() {
    Player.instance().revive();
    monsters = MONSTER_CONFIGS.map(cfg => Monster.create(cfg));

    const arena = document.getElementById('arena-monstros');
    arena.innerHTML = '';
    monsters.forEach(m => arena.appendChild(renderMonster(m)));

    renderPlayer();
}

startGame();