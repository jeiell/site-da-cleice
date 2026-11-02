window.addEventListener('load', () => {
    const intro = document.getElementById('cinema-intro');
    
    if (sessionStorage.getItem('visited')) {
        if(intro) intro.style.display = 'none';
    } else {
        setTimeout(() => {
            if(intro) {
                intro.classList.add('start-cascade');
                setTimeout(() => {
                    intro.style.display = 'none';
                    intro.remove();
                    sessionStorage.setItem('visited', 'true');
                }, 2000);
            }
        }, 1500);
    }
});

// MODAL ORÇAMENTO
const modalForm = document.getElementById("modal-form");
const openBtns = document.querySelectorAll(".open-modal");

function abrirModal() { modalForm.style.display = "flex"; }
function fecharModal() { modalForm.style.display = "none"; }

openBtns.forEach(btn => {
    btn.onclick = () => abrirModal();
});

// MODAL ORIGEM CONSTELAÇÃO
const modalOrigem = document.getElementById("modal-origem");

function abrirOrigem() { modalOrigem.style.display = "flex"; }
function fecharOrigem() { modalOrigem.style.display = "none"; }

// FECHAR MODAIS AO CLICAR FORA
window.onclick = (e) => { 
    if (e.target == modalForm) fecharModal(); 
    if (e.target == modalOrigem) fecharOrigem();
}

// MÁSCARA WHATSAPP
const telInput = document.getElementById('whatsapp-input');
if(telInput) {
    telInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
        v = v.replace(/(\d{5})(\d)/, "$1-$2");
        e.target.value = v;
    });
}

// REVEAL ON SCROLL
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Nav compacta ao rolar
const nav = document.querySelector(".site-nav");
if (nav) {
    const onScroll = () => {
        nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
}

// Menu mobile
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("primary-nav");
if (menuToggle && nav && navLinks) {
    const labelEl = menuToggle.querySelector(".visually-hidden");
    const setOpen = (open) => {
        nav.classList.toggle("is-open", open);
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (labelEl) labelEl.textContent = open ? "Fechar menu" : "Abrir menu";
    };

    menuToggle.addEventListener("click", () => {
        setOpen(!nav.classList.contains("is-open"));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setOpen(false));
    });

    window.addEventListener(
        "keydown",
        (e) => {
            if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false);
        },
        true
    );
}

// Carrossel de depoimentos
(function initTestimonialCarousel() {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;

    const viewport = root.querySelector(".carousel-viewport");
    const track = root.querySelector(".carousel-track");
    const slides = root.querySelectorAll(".carousel-slide");
    const prevBtn = root.querySelector(".carousel-prev");
    const nextBtn = root.querySelector(".carousel-next");
    const dotsWrap = root.querySelector(".carousel-dots");

    if (!viewport || !track || !slides.length || !prevBtn || !nextBtn || !dotsWrap) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) track.style.transition = "none";

    let index = 0;
    let touchStartX = null;

    const dots = Array.from({ length: slides.length }, (_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "carousel-dot";
        b.setAttribute("aria-label", `Ir para depoimento ${i + 1} de ${slides.length}`);
        b.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(b);
        return b;
    });

    function syncDots() {
        dots.forEach((d, i) => {
            const on = i === index;
            d.classList.toggle("is-active", on);
            if (on) d.setAttribute("aria-current", "true");
            else d.removeAttribute("aria-current");
        });
    }

    function goTo(i) {
        const n = slides.length;
        index = ((i % n) + n) % n;
        track.style.transform = `translateX(-${index * 100}%)`;
        slides.forEach((slide, j) => {
            slide.setAttribute("aria-hidden", j === index ? "false" : "true");
        });
        syncDots();
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));

    viewport.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(index - 1);
        }
        if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(index + 1);
        }
    });

    viewport.addEventListener(
        "touchstart",
        (e) => {
            touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
    );

    viewport.addEventListener(
        "touchend",
        (e) => {
            if (touchStartX === null) return;
            const dx = e.changedTouches[0].screenX - touchStartX;
            if (dx > 56) goTo(index - 1);
            if (dx < -56) goTo(index + 1);
            touchStartX = null;
        },
        { passive: true }
    );

    goTo(0);
})();

// MODAIS (com bloqueio de rolagem)
const modalOrg = document.getElementById('modal-organizacional');
function toggleModal(el, open) {
    if (!el) return;
    el.style.display = open ? 'flex' : 'none';
    const algumAberto = [modalForm, modalOrigem, modalOrg].some(m => m && m.style.display === 'flex');
    document.body.style.overflow = algumAberto ? 'hidden' : '';
}
function abrirModal() { toggleModal(modalForm, true); }
function fecharModal() { toggleModal(modalForm, false); }
function abrirOrigem() { toggleModal(modalOrigem, true); }
function fecharOrigem() { toggleModal(modalOrigem, false); }
function abrirOrganizacional() { toggleModal(modalOrg, true); }
function fecharOrganizacional() { toggleModal(modalOrg, false); }

window.onclick = (e) => {
    if (e.target === modalForm) fecharModal();
    if (e.target === modalOrigem) fecharOrigem();
    if (e.target === modalOrg) fecharOrganizacional();
};
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { fecharModal(); fecharOrigem(); fecharOrganizacional(); }
});

// FORMULÁRIO -> WHATSAPP
const form = document.getElementById('agendamento-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = (id) => document.getElementById(id).value.trim();
        const numero = '5599988219080';
        const texto = 'Olá, Cleiciane! Gostaria de solicitar um orçamento:\n\n' +
            `*Nome:* ${val('nome')}\n*E-mail:* ${val('email')}\n` +
            `*WhatsApp:* ${val('whatsapp-input')}\n*Serviço:* ${val('servico')}`;
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
        const msg = document.getElementById('form-msg');
        if (msg) msg.textContent = 'Abrindo o WhatsApp… se não abrir, libere os pop-ups do navegador.';
        setTimeout(() => { fecharModal(); form.reset(); if (msg) msg.textContent = ''; }, 1800);
    });
}

// BARRA DE PROGRESSO + MENU ATIVO
(function () {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const atualizar = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    atualizar();
    window.addEventListener('scroll', atualizar, { passive: true });

    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
            if (!en.isIntersecting) return;
            links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    links.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
})();

// PULAR ABERTURA
const skipBtn = document.getElementById('intro-skip');
if (skipBtn) skipBtn.addEventListener('click', () => {
    const i = document.getElementById('cinema-intro');
    if (!i) return;
    i.classList.add('start-cascade');
    sessionStorage.setItem('visited', 'true');
    setTimeout(() => i.remove(), 1600);
});

// "LER MAIS" NOS SERVIÇOS
document.querySelectorAll('.servico-body').forEach((body) => {
    const extras = [...body.children].filter((el) => el.matches('p, ul')).slice(2);
    if (extras.length < 3) return;
    const wrap = document.createElement('div');
    wrap.className = 'mais-conteudo';
    extras[0].before(wrap);
    extras.forEach((el) => wrap.appendChild(el));
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-mais';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Ler mais';
    wrap.after(btn);
    btn.addEventListener('click', () => {
        const aberto = wrap.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        btn.textContent = aberto ? 'Ler menos' : 'Ler mais';
    });
});

(function () {
    var btn = document.getElementById('btn-sobre-mais');
    var box = document.getElementById('sobre-mais');
    if (!btn || !box) return;
    var container = box.closest('.container');

    btn.addEventListener('click', function () {
        var aberto = box.classList.toggle('is-open');
        if (container) container.classList.toggle('is-expanded', aberto);
        btn.setAttribute('aria-expanded', aberto);
        btn.textContent = aberto ? 'Ler menos' : 'Ler mais';

        // ao fechar, volta para o início da seção para não ficar perdido
        if (!aberto && container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
})();
/* ===== AJUSTES: botões "Agendar" abrem o formulário ===== */
(function () {
    var modal = document.getElementById('modal-form');
    if (!modal) return;

    var h3 = modal.querySelector('.form-header h3');
    var sub = modal.querySelector('.form-header p');
    if (!h3 || !sub) return;

    var original = { titulo: h3.textContent, sub: sub.textContent };
    var agendando = false;

    // Usa o botão "Solicitar Orçamento" que já abre o formulário
    var opener = document.querySelector('.open-modal');

    function setTextos(agendar) {
        h3.textContent = agendar ? 'Agendar uma conversa' : original.titulo;
        sub.textContent = agendar
            ? 'Deixe seus dados e entrarei em contato para combinarmos o melhor horário.'
            : original.sub;
    }

    // Botões "Solicitar Orçamento": mantêm o título original
    document.querySelectorAll('.open-modal').forEach(function (b) {
        b.addEventListener('click', function () {
            setTextos(agendando);
            agendando = false;
        });
    });

    // Botões "Agendar": abrem o mesmo formulário
    document.querySelectorAll('.js-agendar').forEach(function (a) {
        a.addEventListener('click', function (e) {
            if (!opener) return; // sem formulário, segue para o WhatsApp
            e.preventDefault();
            agendando = true;
            opener.click();
        });
    });
})();