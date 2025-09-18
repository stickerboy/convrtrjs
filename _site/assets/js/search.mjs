window.addEventListener('DOMContentLoaded', (event) => {
    new PagefindUI({ 
        element: "#search", 
        showSubResults: true, 
        showImages: false, 
        resetStyles: false,
        pageSize: 10,
        excerptLength: 42,
        translations: {
            placeholder: "Search convrtrs, tools, and other resources...",
        }
    });

    const searchInput = document.querySelector(".pagefind-ui__search-input");
    const searchFilter = document.querySelector('.pagefind-ui__drawer');

    function openDetails() {
        const details = searchFilter.querySelector('details'); 
        if (details && !details.open) {
            details.open = true;
        }
    }

    // Run observer as search filters are injected dynamically on input focus
    function observeDetails() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches('details')) {
                            openDetails();
                        }
                    });
                }
            });
        });

        observer.observe(searchFilter, { childList: true, subtree: true });
    }

    observeDetails();

    searchInput.addEventListener('focus', () => {
        openDetails();
    }, { once: true }); // Only trigger once on first focus
});