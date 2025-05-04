/**
 * Theme toggle functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check for saved theme preference or use OS preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply theme based on saved preference or OS preference
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.documentElement.classList.add('light-theme');
  }
  
  // Set up theme toggle button
  setTimeout(() => {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  }, 500); // Small delay to ensure navbar is loaded
});

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