window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({ 
        element: "#page-search", 
        showSubResults: true, 
        showImages: false, 
        showEmptyFilters: false,
        resetStyles: false,
        pageSize: 10,
        excerptLength: 42,
        openFilters: ['Filters'],
        debounceTimeoutMs: 500,
        translations: {
            placeholder: "Search convrtrs, tools, and other resources...",
        },
        processResult: function (result) {
            console.log(result);
        }
    });
});