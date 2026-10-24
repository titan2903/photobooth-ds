// Layout Navigation System
// Manages smooth horizontal scrolling and button state management

const layoutScrollContainer = document.getElementById('layoutScrollContainer');
const layoutNavLeft = document.getElementById('layoutNavLeft');
const layoutNavRight = document.getElementById('layoutNavRight');

// Scroll distance per button click
const SCROLL_DISTANCE = 200;

// On phones the carousel shows one card per view (see styles.css), so the
// arrows step exactly one card instead of a fixed distance.
const SINGLE_CARD_QUERY = window.matchMedia('(max-width: 540px)');

function scrollByCard(direction) {
    const cards = [...layoutScrollContainer.querySelectorAll('.layout-contents')]
        .filter(card => card.offsetParent !== null);
    if (!cards.length) return;

    const boxLeft = layoutScrollContainer.getBoundingClientRect().left;
    const viewCenter = layoutScrollContainer.scrollLeft + layoutScrollContainer.clientWidth / 2;
    const centers = cards.map(card => {
        const rect = card.getBoundingClientRect();
        return rect.left - boxLeft + layoutScrollContainer.scrollLeft + rect.width / 2;
    });

    // Card currently closest to the middle, then its neighbour in `direction`
    let current = 0;
    centers.forEach((center, i) => {
        if (Math.abs(center - viewCenter) < Math.abs(centers[current] - viewCenter)) current = i;
    });
    const target = Math.min(Math.max(current + direction, 0), cards.length - 1);

    layoutScrollContainer.scrollTo({
        left: centers[target] - layoutScrollContainer.clientWidth / 2,
        behavior: 'smooth'
    });
}

// Initialize button states
function updateNavigationButtonStates() {
    const { scrollLeft, scrollWidth, clientWidth } = layoutScrollContainer;
    
    // Disable left button if at the start
    layoutNavLeft.disabled = scrollLeft <= 0;
    
    // Disable right button if at the end
    layoutNavRight.disabled = scrollLeft + clientWidth >= scrollWidth - 10;
}

// Handle left button click
layoutNavLeft.addEventListener('click', () => {
    if (SINGLE_CARD_QUERY.matches) {
        scrollByCard(-1);
    } else {
        layoutScrollContainer.scrollBy({
            left: -SCROLL_DISTANCE,
            behavior: 'smooth'
        });
    }
    
    // Update button states after scroll completes
    setTimeout(updateNavigationButtonStates, 300);
});

// Handle right button click
layoutNavRight.addEventListener('click', () => {
    if (SINGLE_CARD_QUERY.matches) {
        scrollByCard(1);
    } else {
        layoutScrollContainer.scrollBy({
            left: SCROLL_DISTANCE,
            behavior: 'smooth'
        });
    }
    
    // Update button states after scroll completes
    setTimeout(updateNavigationButtonStates, 300);
    
});

// Update button states when user manually scrolls
layoutScrollContainer.addEventListener('scroll', updateNavigationButtonStates);

// Update on window resize
window.addEventListener('resize', updateNavigationButtonStates);

// Updated Initialize on page load
window.addEventListener('load', () => {
    updateNavigationButtonStates();
    setTimeout(updateNavigationButtonStates, 100);
    setTimeout(updateNavigationButtonStates, 300);
    setTimeout(updateNavigationButtonStates, 600);
});
