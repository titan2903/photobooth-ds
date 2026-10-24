document.addEventListener('DOMContentLoaded', () => {

    const layoutBtn1 = document.querySelector('#layout1Btn');
    const layoutBtn2 = document.querySelector('#layout2Btn');
    const layoutBtn3 = document.querySelector('#layout3Btn');
    const layoutBtn4 = document.querySelector('#layout4Btn');
    const layoutBtn6 = document.querySelector('#layout6Btn');
    const studioModeL5Btn = document.querySelector('#studioModeL5Btn');
    const holidaysLayoutBtn = document.querySelector('#holidaysLayoutBtn');
    const withLoveLayoutBtn = document.querySelector('#withLoveLayoutBtn');
    const classicLayoutBtn = document.querySelector('#classicLayoutBtn');
    const jsbdEventBtn = document.querySelector('#jsbdEventBtn');
    const shbdEventBtn = document.querySelector('#shbdEventBtn');
    const heartsLayoutBtn = document.querySelector('#heartsLayoutBtn');
    const vintageLayoutBtn = document.querySelector('#vintageLayoutBtn');
    const solaceLayoutBtn = document.querySelector('#solaceLayoutBtn');
    const dogLayoutBtn = document.querySelector('#dogLayoutBtn');
    const seiaEventBtn = document.querySelector('#seiaEventBtn');
    const studentIdCardLayoutBtn = document.querySelector('#studentIdCardLayoutBtn');
    const photoboothioLayoutBtn = document.querySelector('#photoboothioLayoutBtn');
    const fgwbLayoutBtn = document.querySelector('#fgwbLayoutBtn');

    // Ensure DB + objectStore exists on layout.html
    let db;
    const request = indexedDB.open("PhotoboothDB", 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Create "images" store only if missing
        if (!db.objectStoreNames.contains("images")) {
            db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
            console.log("Created missing object store: images");
        }
    };

    request.onerror = function () {
        console.error("Failed to open IndexedDB in layout page");
    };


    function clearDBAndNavigate(target) {
        const tx = db.transaction(["images"], "readwrite");
        const store = tx.objectStore("images");

        const clearReq = store.clear();

        clearReq.onsuccess = () => {
            console.log("IndexedDB cleared before navigating:", target);
            window.location.href = target;
        };

        clearReq.onerror = (err) => {
            console.error("Failed to clear IndexedDB:", err);
            window.location.href = target;
        };
    }

    // -----------------------------
    // IMPORTANT PART:
    // Wait for DB to initialize!
    // -----------------------------

    request.onsuccess = function (event) {
        db = event.target.result;
        window.db = db; // Keep global

        console.log("DB ready — layout buttons now safe to use.");

        // ---------------------
        // Register layout buttons
        // ---------------------
        if (layoutBtn1) {
            layoutBtn1.addEventListener('click', (e) => {
                e.preventDefault();
                clearDBAndNavigate('canvas.html');
            });
        }

        if (layoutBtn2) {
            layoutBtn2.addEventListener('click', (e) => {
                e.preventDefault();
                clearDBAndNavigate('canvas4.html');
            });
        }

        if (layoutBtn3) {
            layoutBtn3.addEventListener('click', (e) => {
                e.preventDefault();
                clearDBAndNavigate('canvas2.html');
            });
        }

        if (layoutBtn4) {
            layoutBtn4.addEventListener('click', (e) => {
                e.preventDefault();
                clearDBAndNavigate('canvas6.html');
            });
        }

        if (layoutBtn6) {
            layoutBtn6.addEventListener('click', (e) => {
                e.preventDefault();
                clearDBAndNavigate('layout-e/');
            });
        }

        if (photoboothioLayoutBtn) {
            photoboothioLayoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearDBAndNavigate('photoboothio-layout/');
            });
        }

        if (fgwbLayoutBtn) {
            fgwbLayoutBtn.addEventListener('click', (e) => {
                alert("Available this 10.23 - 10.24, don't miss it! 💌 in collaboration with FGWB / For Girls Who Build ♡");
                e.preventDefault();
                clearDBAndNavigate('FGWB/');
            });
        }

        if (holidaysLayoutBtn) {
            holidaysLayoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearDBAndNavigate('holiday-special/');
            });
        }

        if (classicLayoutBtn) {
            classicLayoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearDBAndNavigate('classic-layout/');
            });
        }

        if (heartsLayoutBtn) {
            heartsLayoutBtn.addEventListener('click', (e) => {
                alert("Feel free to tag us on Instagram @photobooth_io and TikTok @photoboothio ♡");
                e.preventDefault();
                clearDBAndNavigate('hearts-layout.html');
            });
        }

        if (vintageLayoutBtn) {
            vintageLayoutBtn.addEventListener('click', (e) => {
                // alert("Dropping this 02.02.2026! Stay tuned ♡");
                alert("Feel free to tag us on Instagram @photobooth_io and TikTok @photoboothio ♡");
                e.preventDefault();
                clearDBAndNavigate('vintage-layout/');
                // clearDBAndNavigate('hearts-layout.html');
            });
        }

        if (solaceLayoutBtn) {
            solaceLayoutBtn.addEventListener('click', (e) => {
                // alert("Dropping this 02.02.2026! Stay tuned ♡");
                alert("Feel free to tag us on Instagram @photobooth_io and TikTok @photoboothio ♡");
                e.preventDefault();
                clearDBAndNavigate('solace-layout/');
                // clearDBAndNavigate('hearts-layout.html');
            });
        }

        if (withLoveLayoutBtn) {
            withLoveLayoutBtn.addEventListener('click', (e) => {
                // alert("Dropping this 12.12, don’t miss it! 💌");
                e.preventDefault();
                clearDBAndNavigate('with-love/');
            });
        }

        if (jsbdEventBtn) {
            jsbdEventBtn.addEventListener('click', (e) => {
                alert("Our first ever collab layout! credits to @1230.studios ♡");
                e.preventDefault();
                clearDBAndNavigate('joshua-day-event/');
            });
        }

        if (shbdEventBtn) {
            shbdEventBtn.addEventListener('click', (e) => {
                alert("Available this 04.11 - 04.17, don’t miss it! 💌 credits to @_sehunlors ♡");
                e.preventDefault();
                clearDBAndNavigate('sehun-day-event/');
            });
        }

        if (seiaEventBtn) {
            seiaEventBtn.addEventListener('click', (e) => {
                alert("Available this 06.25 - 07. 05, don't miss it! 💌 credits to @seia.atmystudio ♡")
                e.preventDefault();
                clearDBAndNavigate('seia-event/')
            });
        }


        if (dogLayoutBtn) {
            dogLayoutBtn.addEventListener('click', (e) => {
                alert("Feel free to tag us on Instagram @photobooth_io and TikTok @photoboothio ♡");
                e.preventDefault();
                clearDBAndNavigate('dog-filter-layout.html');
            });
        }

        if (studioModeL5Btn) {
            const popup = document.getElementById('studioModePopup');
            const closeBtn = document.getElementById('studioModePopupClose');
            const overlay = document.getElementById('studioModePopupOverlay');
            const continueBtn = document.getElementById('studioModePopupContinue');

            // Whether the popup was opened from the keyboard (Enter/Space on the card).
            let openedViaKeyboard = false;

            // Dismiss the popup only — never navigate away from Choose Layout.
            const dismiss = () => {
                if (!popup) return;
                // Release focus held inside the popup so it doesn't linger on hidden
                // elements, then hand it back to the card only for keyboard users.
                // Restoring it after a mouse open would make Escape paint a
                // :focus-visible ring around the (hover-scaled) Studio Mode card.
                if (popup.contains(document.activeElement)) document.activeElement.blur();
                popup.classList.add('hidden');
                if (openedViaKeyboard) studioModeL5Btn.focus({ preventScroll: true });
            };

            // Explicit user confirmation — this is the only path that proceeds.
            const proceed = () => {
                if (popup) popup.classList.add('hidden');
                clearDBAndNavigate('studio-mode.html');
            };

            // Bind dismiss/proceed handlers once, outside the open click handler,
            // so repeated opens never stack duplicate listeners.
            if (closeBtn) closeBtn.addEventListener('click', dismiss);
            if (overlay) overlay.addEventListener('click', dismiss);
            if (continueBtn) continueBtn.addEventListener('click', proceed);

            // Allow closing with the Escape key for accessibility/UX parity with the X button.
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && popup && !popup.classList.contains('hidden')) {
                    dismiss();
                }
            });

            studioModeL5Btn.addEventListener('click', (e) => {
                e.preventDefault();

                if (!popup) {
                    clearDBAndNavigate('studio-mode.html');
                    return;
                }

                // detail is 0 for clicks synthesized from Enter/Space.
                openedViaKeyboard = e.detail === 0;
                popup.classList.remove('hidden');
                // Move focus into the popup so the card doesn't keep focus underneath it.
                if (closeBtn) closeBtn.focus({ preventScroll: true });
            });
        }

        if (studentIdCardLayoutBtn) {
            studentIdCardLayoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearDBAndNavigate('student-id-card-layout/');
            });
        }
    };

});
