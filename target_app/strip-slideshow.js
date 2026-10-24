/* Hero photostrip slideshows.

   Each [data-slides] box starts with one photo in the page. The other photos
   (comma-separated URLs in data-slides) are downloaded one at a time, only
   when it's their turn, then cross-faded in. The strips take turns so they
   never change at the same moment.

   Runs only after the page has loaded, while the hero is on screen and the
   tab is visible. With reduced motion turned on, the first photo stays. */
(function () {
    "use strict";

    // How long each photo stays up.
    const INTERVAL = 2000;

    const boxes = [...document.querySelectorAll("[data-slides]")];
    if (!boxes.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function createShow(box) {
        const first = box.querySelector(".pb-strip-slide");
        const slides = first ? [first] : [];
        const pending = box.dataset.slides.split(",").map(url => url.trim()).filter(Boolean);
        let current = 0;
        let loading = false;

        function show(index) {
            if (index === current) return;
            slides[current].classList.remove("is-on");
            slides[index].classList.add("is-on");
            current = index;
        }

        function next() {
            // world-map.js hides the box when it would cover a country.
            if (loading || box.classList.contains("is-off")) return;
            if (pending.length && current === slides.length - 1) {
                loading = true;
                const img = new Image();
                img.className = "pb-strip-slide";
                img.alt = "";
                img.decoding = "async";
                img.onload = () => {
                    loading = false;
                    box.appendChild(img);
                    slides.push(img);
                    // Let the browser draw it hidden first so the fade runs.
                    img.getBoundingClientRect();
                    show(slides.length - 1);
                };
                img.onerror = () => {
                    loading = false;
                    next();
                };
                img.src = pending.shift();
                return;
            }
            if (slides.length > 1) show((current + 1) % slides.length);
        }

        return { next };
    }

    const shows = boxes.map(createShow);
    let turn = 0;
    let timer = null;
    let onScreen = true;
    let loaded = document.readyState === "complete";

    function tick() {
        shows[turn % shows.length].next();
        turn += 1;
    }

    function update() {
        const run = loaded && onScreen && !document.hidden;
        if (run && !timer) timer = setInterval(tick, INTERVAL / shows.length);
        if (!run && timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    if ("IntersectionObserver" in window) {
        const seen = new Set();
        new IntersectionObserver(entries => {
            entries.forEach(entry => (entry.isIntersecting ? seen.add(entry.target) : seen.delete(entry.target)));
            onScreen = seen.size > 0;
            update();
        }).observe(boxes[0].closest("[data-map]") || boxes[0]);
    }
    document.addEventListener("visibilitychange", update);
    if (!loaded) {
        window.addEventListener("load", () => {
            loaded = true;
            update();
        }, { once: true });
    }
    update();
})();
