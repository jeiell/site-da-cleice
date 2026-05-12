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

// Lógica para carregar os vídeos sem os títulos do YouTube
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.video-container');
    
    containers.forEach(container => {
        container.addEventListener('click', function() {
            const id = this.getAttribute('data-video-id');
            const iframe = document.createElement('iframe');
            
            // Ativa autoplay e esconde marcas do YouTube
            iframe.setAttribute('src', `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            
            this.innerHTML = '';
            this.appendChild(iframe);
        });
    });
});
function loadVideo(container, videoId) {
    // Cria o iframe do YouTube com autoplay e sem barra de títulos (modestbranding)
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', 'true');
    
    // Limpa o container (remove imagem e botão) e adiciona o iframe
    container.innerHTML = '';
    container.appendChild(iframe);
}

function loadVideo(container, videoId) {
    const params = "?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1";
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}${params}`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', 'true');
    container.innerHTML = '';
    container.appendChild(iframe);
}

function loadVideo(container, videoId) {
    // Parâmetros: autoplay=1 (toca ao carregar), modestbranding=1 (esconde logo), rel=0 (não mostra vídeos aleatórios)
    const params = "?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1";
    
    // Cria o elemento do player (iframe)
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}${params}`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', 'true');
    
    // Remove a imagem de capa e o botão de play e coloca o vídeo real
    container.innerHTML = '';
    container.appendChild(iframe);
}