window.addEventListener('DOMContentLoaded', (event) => {
    new PagefindUI({ 
        element: "#search", 
        showSubResults: true, 
        showImages: false, 
        resetStyles: false,
        pageSize: 10,
        excerptLength: 42
    });
});