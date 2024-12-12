// Disable right-click, text selection, and copying
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('copy', (e) => {
    alert('Copying is not allowed!');
    e.preventDefault();
});

// Block Developer Tools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, etc.)
document.addEventListener('keydown', (e) => {
    if (
        (e.ctrlKey && e.shiftKey && e.code === 'KeyI') || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.code === 'KeyJ') || // Ctrl+Shift+J (Console)
        (e.ctrlKey && e.code === 'KeyU') ||              // Ctrl+U (View Source)
        e.code === 'F12'                                 // F12 Key
    ) {
        e.preventDefault();
        alert('Developer tools are not allowed!');
        return false;
    }
});

// Detect if DevTools is opened by checking element properties
const devToolsCheck = setInterval(() => {
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: () => {
            alert('Developer tools are not allowed!');
            window.location.href = "about:blank"; // Redirect to blank page
        }
    });
    console.log(element); // This triggers the getter when DevTools is open
}, 1000);

// Monitor for DevTools docking (changes in window dimensions)
(function() {
    const devToolsDetection = setInterval(() => {
        if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
            alert('Developer tools are not allowed!');
            window.location.href = "about:blank"; // Redirect to blank page
        }
    }, 1000);
})();

// Block dragging images or saving them
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('mousedown', (e) => {
    if (e.button === 2) {
        alert('Right-click is disabled!');
        e.preventDefault();
    }
});

// Obfuscate console (Prevent users from using the browser console easily)
(function () {
    const originalConsole = console;
    Object.defineProperty(window, 'console', {
        get: function () {
            alert('Access to console is restricted!');
            return originalConsole;
        },
        set: function () {
            alert('Modifying console is not allowed!');
        }
    });
})();

// Detect and block JavaScript debugging
(function blockDebugger() {
    const checkDebugger = () => {
        if (Function('debugger')()) {
            alert('Debugging is not allowed!');
            window.location.href = "about:blank";
        }
    };
    setInterval(checkDebugger, 1000);
})();
const devToolsCheck = setInterval(() => {
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: () => {
            console.warn('Developer tools detected!');
            // Uncomment this to take further action (e.g., redirect):
            // window.location.href = "about:blank";
        }
    });
    console.log(element); // This shouldn't trigger alerts unless DevTools is explicitly open.
}, 1000);
