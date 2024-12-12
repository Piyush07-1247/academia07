// Disable right-click and text selection
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('copy', (e) => {
    alert('Copying is not allowed!');
    e.preventDefault();
});

// Block user interactions such as dragging images
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('mousedown', (e) => {
    if (e.button === 2) { // Right-click
        alert('Right-click is disabled!');
        e.preventDefault();
    }
});

// Block opening DevTools using keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'U')) {
        alert('Developer Tools are disabled!');
        e.preventDefault();
        return false;
    }
});

// Detect when DevTools is opened by checking window size
(function() {
    const devToolsDetection = setInterval(() => {
        if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
            alert('Developer Tools detected!');
            window.location.href = "about:blank"; // Redirect to blank page or block site entirely
        }
    }, 1000);
})();

// Block access to the console after the page has loaded
window.addEventListener('load', function() {
    const originalConsole = console;
    Object.defineProperty(window, 'console', {
        get: function() {
            alert('Access to console is restricted!');
            return originalConsole;
        },
        set: function() {
            alert('Modifying console is not allowed!');
        }
    });
});

// Block access to the "Elements" and "Sources" tabs (DevTools)
(function() {
    // Override the `open` function to prevent opening DevTools-related URLs
    const originalOpen = window.open;
    window.open = function(url) {
        if (url.includes('devtools://')) {
            alert('Access to Developer Tools is restricted!');
            return null; // Block the open attempt
        }
        return originalOpen.apply(window, arguments);
    };

    // Block access to the Elements tab using the Image() trick (check if the `id` property is accessed)
    const devToolsCheck = setInterval(() => {
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                alert('Developer Tools are open!');
                window.location.href = "about:blank"; // Block site if DevTools is open
            }
        });
        console.log(element); // If DevTools is open, this will trigger the alert
    }, 1000);
})();

// Block drag, copy, and right-click actions
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('mousedown', (e) => {
    if (e.button === 2) { // Right-click
        alert('Right-click is disabled!');
        e.preventDefault();
    }
});

// Prevent DOM content from being selected or copied
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('copy', (e) => {
    alert('Copying is not allowed!');
    e.preventDefault();
});

// CSS to prevent copying and inspect element
const style = document.createElement('style');
style.innerHTML = `
    /* Prevent text selection */
    body {
        user-select: none !important;
    }
    /* Disable pointer events for all elements except critical UI elements */
    * {
        pointer-events: auto;
    }
    /* Overlay to block right-click on all elements */
    body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.5); /* Transparent overlay */
        pointer-events: none; /* Allow clicks through the overlay */
        z-index: 9999;
    }
    /* Prevent visibility of hidden text (if exposed by inspecting) */
    .hidden-text {
        visibility: hidden !important;
        display: none !important;
    }
`;

document.head.appendChild(style);
