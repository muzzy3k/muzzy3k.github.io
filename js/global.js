/**
   * 
   * Initializing function to load global components
   */
async function initGlobal() {
    try {
        await loadComponent('components/navbar.html', 'navbar');
        await loadComponent('components/footer.html', 'footer');
    } catch (error) {
        console.error('Error loading components:', error);
    }
}


/**
   * 
   * Function to load component based on path and elementid
   * @para {string, string} path, id of element
   */
async function loadComponent(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Initialize theme toggle after navbar loads
        if (elementId === 'navbar') {
            setTimeout(() => {
                const themeToggle = document.getElementById('theme-toggle');
                if (themeToggle) {
                    themeToggle.addEventListener('click', toggleTheme);
                }
            }, 100);
        }
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const root = document.documentElement;
    
    if (root.classList.contains('light-theme')) {
        // Switch to dark theme
        root.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        // Switch to light theme
        root.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Check for saved theme preference when page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme based on saved preference or OS preference
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.documentElement.classList.add('light-theme');
    }
});

// Initialize global components
window.addEventListener("load", initGlobal);