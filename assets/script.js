(function () {
    // Basic DOM helpers
    const byId = id => document.getElementById(id);
    const ls = window.localStorage;

    // Theme toggle
    const modeToggle = byId('modeToggle');
    const modeToggleTeam = byId('modeToggleTeam');
    function applyTheme(t) {
        if (t === 'light') {
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
        }
        ls.setItem('site-theme', t);
    }
    function toggleTheme() {
        const cur = ls.getItem('site-theme') || 'dark';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
    }
    if (modeToggle) modeToggle.addEventListener('click', toggleTheme);
    if (modeToggleTeam) modeToggleTeam.addEventListener('click', toggleTheme);
    // initialize
    applyTheme(ls.getItem('site-theme') || 'dark');

    // Mobile menu toggles
    const mobileToggle = byId('mobileToggle');
    const mobileMenu = byId('mobileMenu');
    const mobileMenuA = document.querySelectorAll("#mobileMenu a");
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    }
    const mobileToggleTeam = byId('mobileToggleTeam');
    const mobileMenuTeam = byId('mobileMenuTeam');
    if (mobileToggleTeam && mobileMenuTeam) {
        mobileToggleTeam.addEventListener('click', () => {
            mobileMenuTeam.classList.toggle('hidden');

        })
    }

    // Year in footer
    const yr = new Date().getFullYear();
    const e = document.getElementById('yr'); if (e) e.textContent = yr;
    const e2 = document.getElementById('yr2'); if (e2) e2.textContent = yr;

    // AUDIT Form submit

    const form = document.getElementById("auditForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        const response = await fetch(form.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            alert("✅ Thanks — we received your audit request! \n Our team would get back to you through the email you provided.");
            form.reset();
        } else {
            alert("❌ Something went wrong. Please try again.");
        }
    });

    // REVIEW Form submit

    const RVform = document.getElementById("contactForm");

    RVform.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(RVform);

        const response = await fetch(RVform.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            alert("✅ Thanks — we received your contacting us!");
            RVform.reset();
        } else {
            alert("❌ Something went wrong. Please try again.");
        }
    });


    // WhatsApp quick chat
    const waBtn = byId('whatsAppBtn');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            location.href("https://wa.me/+16139272170");
        });
    }

    // Language loader - loads /lang/{code}.json and replaces elements with [data-key]
    const langFiles = ['en', 'fr', 'es'];
    function populateLangSwitcher(id) {
        const el = document.getElementById(id);
        if (!el) return;
        langFiles.forEach(code => {
            const opt = document.createElement('option');
            opt.value = code;
            opt.textContent = code.toUpperCase();
            el.appendChild(opt);
        });
        el.value = ls.getItem('site-lang') || 'en';
        el.addEventListener('change', (ev) => { setLang(ev.target.value); });
    }
    populateLangSwitcher('langSwitcher');
    populateLangSwitcher('langSwitcherTeam');

    async function setLang(code) {
        ls.setItem('site-lang', code);
        try {
            const res = await fetch('../lang/' + code + '.json');
            if (!res.ok) return;
            const data = await res.json();
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                const parts = key.split('.');
                let v = data; for (const p of parts) { if (v && p in v) v = v[p]; else { v = null; break } }
                if (v) {
                    if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                        el.placeholder = v;
                    } else {
                        el.textContent = v;
                    }
                }
            });
        } catch (err) { console.warn('Lang load failed', err) }
    }

    // initialize language
    setLang(ls.getItem('site-lang') || 'en');

    // Simple scroll reveal for elements with 'card' class
    const revealOnScroll = () => {
        document.querySelectorAll('.card').forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) card.classList.add('in-view');
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
})();


// Highlight active nav link automatically
window.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav a");
    const currentPath = window.location.pathname.split("/").pop(); // e.g. "team.html"

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath || (href === "index.html" && currentPath === "")) {
            link.classList.add("active");
        }
    });
});

document.querySelectorAll("a").forEach(e => {
    e.addEventListener("click", () => {
        e.target = "_self";
    })

})
