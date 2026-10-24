document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.layout-filter-btn');
    const cards = document.querySelectorAll('.layout-contents');
    const scrollContainer = document.getElementById('layoutScrollContainer');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterButtons.forEach((b) => {
                const isActive = b === btn;
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            cards.forEach((card) => {
                const matches = filter === 'all' || card.dataset.category === filter;
                card.style.display = matches ? '' : 'none';
            });

            if (scrollContainer) scrollContainer.scrollLeft = 0;
            // Re-run the nav-arrow enabled/disabled check now that the
            // scrollable content width has changed.
            window.dispatchEvent(new Event('resize'));
        });
    });
});
