// Frame Color: marks the swatch whose color/background is on the strip,
// the same way the sticker and photo shape buttons show their pick.
//
// The section is the one holding #colorPickerBtn, or, on pages that pick
// the frame through templates (With Love, Holiday), the one marked
// data-frame-swatches. Only those swatches and the custom color picker
// change the frame, so following clicks here is enough. The page's default
// swatch carries .is-selected in the HTML.
(function () {
    "use strict";

    const picker = document.getElementById("colorPickerBtn");
    const box = picker
        ? picker.closest(".custom-buttons-container")
        : document.querySelector("[data-frame-swatches]");
    if (!box) return;

    const SWATCH = ".buttonFrames, .buttonBgFrames, .holidayButtonFrames";
    const swatches = [...box.children].filter(el => el.matches(SWATCH));

    function select(chosen) {
        swatches.forEach(el => {
            const on = el === chosen;
            el.classList.toggle("is-selected", on);
            if (el.tagName === "BUTTON") el.setAttribute("aria-pressed", String(on));
        });
    }

    box.addEventListener("click", event => {
        const el = event.target.closest(SWATCH);
        if (el && el !== picker && el.parentElement === box) select(el);
    });

    // The picker's popup lives inside #colorPickerBtn and applies its color
    // while the user drags a slider or types a value, not when it opens.
    const PICKER_INPUT = ".picker_sl, .picker_hue, .picker_alpha, .picker_editor";
    if (picker) {
        ["pointerdown", "keydown", "input"].forEach(type => {
            picker.addEventListener(type, event => {
                if (event.target.closest(PICKER_INPUT)) select(picker);
            });
        });
    }

    select(swatches.find(el => el.classList.contains("is-selected")) || null);
})();
