// "Change Layout" section for customize pages - lets a user swap to a
// different layout template with the same photo count, keeping their
// already-captured photos (every layout shares the same PhotoboothDB/images
// IndexedDB store, so simply navigating to the new layout's customize page
// is enough - nothing needs to be copied). Requires js/layout-catalog.js to
// be loaded first.
function initLayoutSwitcher(containerEl, currentLayoutKey) {
    if (!containerEl) return;

    const current = LAYOUT_CATALOG.find((layout) => layout.key === currentLayoutKey);
    if (!current) return;

    // Layouts flagged hideAsSwitchTarget (Hearts/Dog Filter) are excluded
    // here regardless of who's looking: their effect is composited onto
    // the photo live during capture, so arriving at their customize page
    // via this grid instead of their actual capture page leaves a visitor
    // on a "Hearts Filter" screen with plain, unfiltered photos and no way
    // to fix that - a dead end, not a shortcut. This only hides them as a
    // *target*; current itself is never filtered out below, so a visitor
    // already on Hearts/Dog Filter still sees this section (see the note
    // appended further down) and can switch *away* to a plain layout fine.
    const alternatives = LAYOUT_CATALOG.filter(
        (layout) => layout.key !== currentLayoutKey && layout.photoCount === current.photoCount && !layout.hideAsSwitchTarget
    );

    const section = containerEl.closest(".custom-options-container");

    // Nothing to switch to (e.g. Layout C and Layout D are each alone in
    // their photo-count bucket) - hide the whole section, not just the grid.
    if (alternatives.length === 0) {
        if (section) section.style.display = "none";
        return;
    }

    if (section) section.style.display = "";
    containerEl.innerHTML = "";

    // Visitor is currently on Hearts/Dog Filter's own customize page -
    // explain why picking a new frame here won't add or remove that filter,
    // since the alternatives above can only be plain layouts, never another
    // filtered one.
    if (current.hideAsSwitchTarget) {
        const note = document.createElement("p");
        note.className = "dd-sticker-hint layout-switcher-note";
        note.textContent = `Your ${current.name.toLowerCase()} is already part of these photos - switching frames here won't add or remove it.`;
        containerEl.before(note);
    }

    alternatives.forEach((layout) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "layout-switcher-option";
        btn.innerHTML = `
            <img src="${layout.thumbnail}" alt="${layout.name}" loading="lazy" decoding="async">
            <span class="layout-switcher-label">${layout.name}</span>
        `;
        btn.addEventListener("click", () => {
            // So a later Retake on the new customize page sends the user to
            // the right camera flow, instead of wherever they originally
            // came from.
            sessionStorage.setItem("returnLayout", layout.capturePage);
            window.location.href = layout.customizePage;
        });
        containerEl.appendChild(btn);
    });
}
