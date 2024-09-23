
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
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
    }
}

// Initialize global components
window.addEventListener("load", initGlobal);