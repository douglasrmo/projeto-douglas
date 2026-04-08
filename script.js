// ---------- ESTADO ----------
let naoCliques = 0;
const MAX_NAO  = 5;

// ---------- ELEMENTOS ----------
const btnSim    = document.getElementById('btn-sim');
const btnNao    = document.getElementById('btn-nao');
const frase     = document.getElementById('frase');
const hint      = document.getElementById('contador-hint');
const telaPerg  = document.getElementById('tela-pergunta');
const telaFinal = document.getElementById('tela-final');
const canvas    = document.getElementById('canvas');
const ctx       = canvas.getContext('2d');

// ---------- FRASES ----------
const frases = [
  "A vitória ama o Douglas?",
  "Tem certeza que não? 🤔",
  "Ei mano, tem certeza?",
  "você não vai casar cmg?",
  "Você REALMENTE acha que não??",
];

const hints = [
  "",
  "o 'Sim' tá crescendo, percebeu?",
  "o 'Não' vai desaparecer em breve...",
  "só mais uma vez e acabou...",
  "acabou, só resta a verdade.",
];

// ---------- ESTRELINHAS ----------
(function gerarEstrelas() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left  = Math.random() * 100 + '%';
    s.style.top   = Math.random() * 100 + '%';
    s.style.setProperty('--dur',   (2 + Math.random() * 4) + 's');
    s.style.setProperty('--delay', (Math.random() * 5) + 's');
    container.appendChild(s);
  }
})();

// ---------- CANVAS ----------
function redimensionar() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
redimensionar();
window.addEventListener('resize', redimensionar);

// ---------- CLICAR NÃO ----------
function clicarNao() {
  if (naoCliques >= MAX_NAO) return;
  naoCliques++;

  // Cresce o botão SIM
  const escala  = [1, 1.35, 1.75, 2.2, 3.0][naoCliques - 1];
  const fs      = 15 * escala;
  const padV    = 14 * escala;
  const padH    = 40 * escala;
  btnSim.style.fontSize = fs + 'px';
  btnSim.style.padding  = padV + 'px ' + padH + 'px';

  // Atualiza frase e hint
  frase.textContent = frases[naoCliques] || frases[frases.length - 1];
  hint.textContent  = hints[naoCliques]  || hints[hints.length - 1];

  // Na 5ª vez, some o Não
  if (naoCliques >= MAX_NAO) {
    btnNao.classList.add('sumindo');
    setTimeout(() => { btnNao.style.display = 'none'; }, 600);
  }
}

// ---------- CLICAR SIM ----------
function clicarSim() {
  // Troca de tela
  telaPerg.classList.remove('ativa');
  setTimeout(() => {
    telaFinal.classList.add('ativa');
  }, 100);

  // Fogos + Confetes
  redimensionar();
  setTimeout(dispararFogos,   200);
  setTimeout(chuvaConfetes,   400);
  setTimeout(dispararFogos,  1200);
  setTimeout(chuvaConfetes,  1500);
}

// ---------- REINICIAR ----------
function reiniciar() {
  naoCliques = 0;
  frase.textContent = frases[0];
  hint.textContent  = '';
  btnSim.style.fontSize = '';
  btnSim.style.padding  = '';
  btnNao.classList.remove('sumindo');
  btnNao.style.display  = '';

  telaFinal.classList.remove('ativa');
  setTimeout(() => {
    telaPerg.classList.add('ativa');
  }, 100);

  particulas.length = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ---------- SISTEMA DE PARTÍCULAS ----------
const particulas = [];

function criarExplosao(x, y, quantidade, tipo) {
  const cores = ['#C9A84C','#F0D080','#E8C86A','#ffffff','#F5D090','#D4A840'];
  for (let i = 0; i < quantidade; i++) {
    const angulo    = (Math.PI * 2 / quantidade) * i + Math.random() * 0.5;
    const velocidade = tipo === 'fogo' ? (3 + Math.random() * 5) : (1 + Math.random() * 3);
    particulas.push({
      x, y,
      vx: Math.cos(angulo) * velocidade,
      vy: Math.sin(angulo) * velocidade - (tipo === 'fogo' ? 2 : 0),
      alpha: 1,
      cor: cores[Math.floor(Math.random() * cores.length)],
      r: tipo === 'fogo' ? (Math.random() * 3 + 1) : (Math.random() * 5 + 3),
      tipo,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      w: Math.random() * 8 + 5,
      h: Math.random() * 4 + 3,
    });
  }
}

function dispararFogos() {
  const qtd = 5;
  for (let i = 0; i < qtd; i++) {
    setTimeout(() => {
      const x = canvas.width  * (0.2 + Math.random() * 0.6);
      const y = canvas.height * (0.1 + Math.random() * 0.4);
      criarExplosao(x, y, 40, 'fogo');
    }, i * 120);
  }
  animar();
}

function chuvaConfetes() {
  for (let i = 0; i < 100; i++) {
    particulas.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      alpha: 1,
      cor: ['#C9A84C','#F0D080','#ffffff','#D4A840','#F5F0E8','#E8C86A'][Math.floor(Math.random()*6)],
      r: 0,
      tipo: 'confete',
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 5,
      w: Math.random() * 9 + 5,
      h: Math.random() * 4 + 3,
    });
  }
  animar();
}

let animando = false;

function animar() {
  if (animando) return;
  animando = true;
  loop();
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];

    p.x  += p.vx;
    p.y  += p.vy;
    p.rot += p.rotV;

    if (p.tipo === 'fogo') {
      p.vy    += 0.1;
      p.alpha -= 0.018;
    } else {
      p.alpha -= 0.005;
    }

    if (p.alpha <= 0 || p.y > canvas.height + 30) {
      particulas.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = p.cor;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI / 180);

    if (p.tipo === 'fogo') {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }

    ctx.restore();
  }

  if (particulas.length > 0) {
    requestAnimationFrame(loop);
  } else {
    animando = false;
  }
}
