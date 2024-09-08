async function initGlobal() {
    try {
        await loadComponent('components/navbar.html', 'navbar');
        await loadComponent('components/footer.html', 'footer');
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

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

window.addEventListener("load", initGlobal);