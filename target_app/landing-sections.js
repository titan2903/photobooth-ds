/* ==========================================================================
   Landing Sections: interactivity
   ----------------------------------------------------------------------
   1. Pubmats grid: data-driven cards (new feature), links out to IG.
      Each entry takes an `img` (the exported Instagram pubmat, 4:5).
      Without one, the card falls back to a brand-color tile with a
      neutral placeholder mark.
   2. FAQ accordion: real toggle behavior (the about.html FAQ is
      static; this one on the landing page actually expands/collapses).
   3. Restrained scroll-reveal for the new sections.
   ========================================================================== */

(function () {
    "use strict";

    const IG_URL = "https://www.instagram.com/photobooth_io/";

    // Real announcements, each with its Instagram pubmat
    // (assets/pubmats-feature, 720x900 WebP). `url` is the post itself;
    // without one the card opens the Instagram profile.
    const pubmats = [
        {
            tone: "pink",
            title: "Drag & Drop Stickers",
            date: "Oct 2026",
            desc: "Place, resize, flip & rotate stickers anywhere on your strip.",
            img: "/assets/pubmats-feature/drag-drop.webp",
            url: "https://www.instagram.com/p/De1biyfo8gu/"
        },
        {
            tone: "pink",
            title: "Ad-Free",
            date: "Sept 2026",
            desc: "No ads, and Studio Mode opens without one. Every standard feature stays free.",
            img: "/assets/pubmats-feature/ad-free.webp",
            url: "https://www.instagram.com/p/Detedico2LU/"
        },
        {
            tone: "purple",
            title: "Studio Mode",
            date: "Sept 2026",
            desc: "A moody studio-style layout, now with a video version and a QR code.",
            img: "/assets/pubmats-feature/studio-mode.webp",
            url: "https://www.instagram.com/p/DclBvprkTwd/"
        },
        {
            tone: "yellow",
            title: "Student ID Card Layout",
            date: "Sept 2026",
            desc: "A playful ID-card inspired strip layout.",
            img: "/assets/pubmats-feature/student-id-card.webp",
            url: "https://www.instagram.com/p/DdtWH4vo_Jh/"
        },
        {
            tone: "brown",
            title: "Dog Filter Layout",
            date: "May 2026",
            desc: "Add a little puppy magic to your photo strip.",
            img: "/assets/pubmats-feature/dog-filter.webp",
            url: "https://www.instagram.com/p/DYjwKSLkQVo/"
        },
        {
            tone: "pink",
            title: "Hearts Filter Layout",
            date: "Jan 2026",
            desc: "A macbook-hearts inspired overlay for your photos.",
            img: "/assets/pubmats-feature/hearts-filter.webp",
            url: "https://www.instagram.com/p/DTurtHfEmS7/"
        }
    ];

    // Shared neutral placeholder, the same camera-square mark already
    // used on the site's social buttons, so an un-imaged card still
    // looks on-brand instead of showing a decorative emoji per item.
    const PLACEHOLDER_ICON =
        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="2.5" y="2.5" width="19" height="19" rx="6" stroke="currentColor" stroke-width="1.8"/>' +
        '<circle cx="12" cy="12" r="4.4" stroke="currentColor" stroke-width="1.8"/>' +
        '<circle cx="17.4" cy="6.6" r="1.15" fill="currentColor"/>' +
        "</svg>";

    function renderPubmats() {
        const grid = document.getElementById("pubmatsGrid");
        if (!grid) return;

        const html = pubmats.map(function (item) {
            const media = item.img
                ? '<div class="pubmat-media has-img"><img src="' + item.img + '" alt="' + item.title +
                ' Instagram post" width="720" height="900" loading="lazy" decoding="async"></div>'
                : '<div class="pubmat-media tone-' + item.tone + '">' + PLACEHOLDER_ICON + "</div>";

            return (
                '<a class="pubmat-card" href="' + (item.url || IG_URL) + '" target="_blank" rel="noopener">' +
                media +
                '<div class="pubmat-body">' +
                '<span class="pubmat-date">' + item.date + "</span>" +
                '<h3 class="pubmat-title">' + item.title + "</h3>" +
                '<p class="pubmat-desc">' + item.desc + "</p>" +
                '<span class="pubmat-link-row">View on Instagram' +
                '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                "</svg>" +
                "</span>" +
                "</div>" +
                "</a>"
            );
        }).join("");

        grid.innerHTML = html;
    }

    function initFaqAccordion() {
        const items = document.querySelectorAll("#faqAccordion .faq-item");
        items.forEach(function (item) {
            const question = item.querySelector(".faq-question");
            const answer = item.querySelector(".faq-answer");
            const inner = item.querySelector(".faq-answer-inner");
            if (!question || !answer || !inner) return;

            question.addEventListener("click", function () {
                const isOpen = item.classList.contains("open");

                // Close any other open item for a tidy single-open accordion.
                items.forEach(function (other) {
                    if (other !== item && other.classList.contains("open")) {
                        other.classList.remove("open");
                        other.querySelector(".faq-answer").style.maxHeight = null;
                    }
                });

                if (isOpen) {
                    item.classList.remove("open");
                    answer.style.maxHeight = null;
                } else {
                    item.classList.add("open");
                    answer.style.maxHeight = inner.scrollHeight + "px";
                }
            });
        });
    }

    function initScrollReveal() {
        const targets = document.querySelectorAll(".reveal-on-scroll");
        if (!("IntersectionObserver" in window) || !targets.length) {
            targets.forEach(function (el) { el.classList.add("is-visible"); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        targets.forEach(function (el) { observer.observe(el); });
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderPubmats();
        initFaqAccordion();
        initScrollReveal();
    });
})();
