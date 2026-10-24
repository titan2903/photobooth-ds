// Shared catalog of layouts eligible for cross-layout switching on customize
// pages. Studio Mode is intentionally never listed here (its QR/rewarded-ad
// unlock flow doesn't fit the plain capture->customize pipeline) - that's
// what keeps it out of every "Change Layout" grid site-wide, since
// js/layout-switcher.js only ever reads from this array. Hearts Filter and
// Dog Filter share customize.html with Layout A/B/C (see customize.js's
// CURRENT_LAYOUT_KEY_BY_RETURN_LAYOUT) and are listed below like any other
// layout, for UI/UX consistency across all template types.
// Photo counts are verified against each capture page's own
// `images.length === N` checks, not chooseLayout.html's display text (which
// mislabels Solace as 4-pose (it's 3) and Student ID Card as 1-pose (it
// captures 4, then lets the user pick 1 for the final card)).
const LAYOUT_CATALOG = [
    {
        key: "layoutA",
        name: "Layout A",
        thumbnail: "/assets/layouts/layout_A.webp",
        capturePage: "/canvas.html",
        customizePage: "/customize.html",
        photoCount: 3,
    },
    {
        key: "layoutB",
        name: "Layout B",
        thumbnail: "/assets/layouts/layout_B.webp",
        capturePage: "/canvas4.html",
        customizePage: "/customize.html",
        // Same photoCount (4) as Hearts/Dog Filter below, which is the only
        // reason it shows up as a switch option on their customize pages -
        // same strip size/photo count, not a themed match.
        photoCount: 4,
    },
    {
        key: "layoutC",
        name: "Layout C",
        thumbnail: "/assets/layouts/layout_C.webp",
        capturePage: "/canvas2.html",
        customizePage: "/customize.html",
        photoCount: 2,
    },
    {
        key: "layoutD",
        name: "Layout D",
        thumbnail: "/assets/layouts/layout_D.webp",
        capturePage: "/canvas6.html",
        customizePage: "/customize6.html",
        photoCount: 6,
    },
    {
        key: "heartsFilter",
        name: "Hearts Filter",
        thumbnail: "/assets/layouts/hearts_filter.webp",
        capturePage: "/hearts-layout.html",
        customizePage: "/customize.html",
        photoCount: 4,
        // The heart overlay is composited onto each photo live during
        // capture (see hearts-layout.js) - there's no step on the customize
        // page that could add it after the fact, so offering this as a
        // switch *target* from another layout would just land the visitor
        // on an empty-looking "Hearts Filter" session with their plain
        // photos and no way to get the actual filter. Hidden from
        // js/layout-switcher.js's target list for that reason (see
        // hideAsSwitchTarget below); switching *away* from here to a plain
        // layout is unaffected; still works, since the heart overlay is
        // already baked into the stored photos regardless of which frame
        // wraps them.
        hideAsSwitchTarget: true,
    },
    {
        key: "dogFilter",
        name: "Dog Filter",
        thumbnail: "/assets/layouts/dog_filter.webp",
        capturePage: "/dog-filter-layout.html",
        customizePage: "/customize.html",
        photoCount: 4,
        // Same reasoning as heartsFilter above - the dog-ear overlay only
        // ever gets composited in at capture time.
        hideAsSwitchTarget: true,
    },
    {
        key: "classic",
        name: "Classic Layout",
        thumbnail: "/assets/layouts/classic_layout.webp",
        capturePage: "/classic-layout/index.html",
        customizePage: "/classic-customize/index.html",
        photoCount: 4,
    },
    {
        key: "vintage",
        name: "Vintage Layout",
        thumbnail: "/assets/layouts/vintage_layout.webp",
        capturePage: "/vintage-layout/index.html",
        customizePage: "/vintage-customize/index.html",
        photoCount: 4,
    },
    {
        key: "solace",
        name: "Solace Layout",
        thumbnail: "/assets/layouts/solace_layout.webp",
        capturePage: "/solace-layout/index.html",
        customizePage: "/solace-customize/index.html",
        photoCount: 3,
    },
    {
        key: "withLove",
        name: "With Love Layout",
        thumbnail: "/assets/layouts/with_love_layout.webp",
        capturePage: "/with-love/index.html",
        customizePage: "/with-love-customize/index.html",
        photoCount: 4,
    },
    {
        key: "holidays",
        name: "Holidays Layout",
        thumbnail: "/assets/layouts/holidays_layout.webp",
        capturePage: "/holiday-special/index.html",
        customizePage: "/holiday-special-customize/index.html",
        photoCount: 4,
    },
    {
        key: "layoutE",
        name: "Layout E",
        thumbnail: "/assets/layouts/layout_E.webp",
        capturePage: "/layout-e/index.html",
        customizePage: "/customize-layout-e/index.html",
        photoCount: 4,
    },
    {
        key: "photoboothio",
        name: "Photobooth-io Layout",
        thumbnail: "/assets/layouts/photoboothio_layout.webp",
        capturePage: "/photoboothio-layout/index.html",
        customizePage: "/photoboothio-customize/index.html",
        photoCount: 4,
    },
    {
        key: "fgwb",
        name: "Knock Knock: Build or Treat",
        thumbnail: "/assets/layouts/FGWB.webp",
        capturePage: "/FGWB/index.html",
        customizePage: "/FGWB-Customize/index.html",
        photoCount: 4,
    },
    {
        key: "idcard",
        name: "Student ID Card",
        thumbnail: "/assets/layouts/idcard1.webp",
        capturePage: "/student-id-card-layout/index.html",
        customizePage: "/student-id-card-customize/index.html",
        photoCount: 4,
        // Single-photo-box template (pick 1 of N), not a multi-slot strip -
        // "slot order" doesn't apply, so it never gets a reorder section.
        reorderable: false,
    },
];
