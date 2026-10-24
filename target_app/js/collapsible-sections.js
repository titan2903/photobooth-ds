// Makes every customize-page options section (Change Layout, Reorder
// Photos, Frame Color, Photo Shape, Stickers, Drag & Drop Stickers,
// Doodle, Logo, Templates, ...) collapsible. This is generic and
// page-agnostic on purpose: it just looks for <h3 class="options-label">
// headings - the one class every section heading already shares across
// every customize page - and wraps each heading plus whatever content
// immediately follows it into a toggleable box. That means it works
// unmodified on every customize page regardless of which sections that
// particular page has, and regardless of how each section happens to be
// nested in that page's markup today.
//
// Icons: SVG Repo "arrow-down" (expanded) and "arrow-next-small"
// (collapsed), recolored to currentColor so they follow the heading's
// text color.
(function () {
    const ICON_DOWN =
        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="currentColor"/>' +
        '</svg>';
    const ICON_RIGHT =
        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" fill="currentColor"/>' +
        '</svg>';

    // An element marks the start of the *next* section, so we stop
    // absorbing siblings into the current box as soon as we reach one -
    // whether it IS a heading itself, or just happens to contain one
    // nested somewhere inside it (some pages nest one section's markup
    // inside another's wrapper div without that being a real parent/child
    // relationship between the two sections).
    function startsNextSection(node) {
        if (node.nodeType !== 1) return false;
        return node.matches('.options-label') || !!node.querySelector('.options-label');
    }

    function initCollapsibleSections() {
        // Snapshot first: a live NodeList would shift under us as we move
        // nodes around below.
        const headings = Array.from(document.querySelectorAll('h3.options-label'));

        headings.forEach(function (h3) {
            const parent = h3.parentElement;
            if (!parent) return;

            const box = document.createElement('div');
            box.className = 'options-section';
            parent.insertBefore(box, h3);
            box.appendChild(h3);

            let next = box.nextSibling;
            while (next && !startsNextSection(next)) {
                const toMove = next;
                next = next.nextSibling;
                box.appendChild(toMove);
            }

            const labelText = document.createElement('span');
            labelText.className = 'options-label-text';
            labelText.textContent = h3.textContent;
            h3.textContent = '';

            const icon = document.createElement('span');
            icon.className = 'options-toggle-icon';
            icon.innerHTML = ICON_DOWN;

            h3.appendChild(icon);
            h3.appendChild(labelText);

            h3.setAttribute('role', 'button');
            h3.setAttribute('tabindex', '0');
            h3.setAttribute('aria-expanded', 'true');

            function toggle() {
                const collapsed = box.classList.toggle('collapsed');
                h3.setAttribute('aria-expanded', String(!collapsed));
                icon.innerHTML = collapsed ? ICON_RIGHT : ICON_DOWN;
            }

            h3.addEventListener('click', toggle);
            h3.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCollapsibleSections);
    } else {
        initCollapsibleSections();
    }
})();
