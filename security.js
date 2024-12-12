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

// Detect DevTools being opened using window size change detection
(function () {
    const devToolsDetection = setInterval(() => {
        // Check if the window's outer width/height is significantly larger than inner width/height
        if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
            alert('Developer tools are not allowed!');
            window.location.href = "about:blank"; // Redirect to blank page or block site entirely
        }
    }, 1000);
})();

// Detect DevTools opening by checking for debugger keyword
(function () {
    const checkDebugger = () => {
        if (Function('debugger')()) {
            alert('Debugging is not allowed!');
            window.location.href = "about:blank"; // Redirect to blank page or block site entirely
        }
    };
    setInterval(checkDebugger, 1000);
})();

// Disable access to the console (block console actions)
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

// Detect key combinations for opening DevTools (F12, Ctrl+Shift+I, etc.)
document.addEventListener('keydown', (e) => {
    if (
        (e.ctrlKey && e.shiftKey && e.code === 'KeyI') || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.code === 'KeyJ') || // Ctrl+Shift+J
        (e.ctrlKey && e.code === 'KeyU') ||              // Ctrl+U
        e.code === 'F12'                                 // F12
    ) {
        e.preventDefault();
        alert('Developer tools are not allowed!');
        return false;
    }
});

// Disable context menu, making it harder to inspect elements via right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Detect if DevTools is open based on console object detection
const devToolsCheck = setInterval(() => {
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: () => {
            alert('Developer tools are open!');
            window.location.href = "about:blank"; // Stop the website if DevTools is detected
        }
    });
    console.log(element); // This triggers the getter when DevTools is open
}, 1000);

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

// Blocking the right-click context menu in DevTools (disabling element inspection)
document.addEventListener('contextmenu', (e) => {
    if (e.target === document) {
        e.preventDefault();
        alert('Right-click is disabled!');
    }
});

// Block access to the "Elements" tab in DevTools (Prevent DOM inspection)
document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        alert('Access to Elements tab is restricted!');
        e.preventDefault();
    }
});

// Disable access to sources and elements in the DevTools
(function () {
    // Block access to DevTools Source tab (Prevent inspecting source code)
    Object.defineProperty(window, 'open', {
        value: function () {
            if (arguments[0].includes('devtools')) {
                alert('Access to Developer Tools is restricted!');
                return null;
            }
            return open.apply(window, arguments);
        },
        writable: false
    });

    // Block access to DevTools Sources tab
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
})();
