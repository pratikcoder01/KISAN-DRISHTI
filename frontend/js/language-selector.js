/**
 * KISAN-DRISHTI — Language Selector Component
 * Reusable language selector for all pages
 */

// Create language selector HTML
function createLanguageSelector() {
  return `
    <div class="language-selector fixed top-4 right-20 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 p-1">
      <div class="flex items-center gap-2">
        <span class="material-icons text-slate-500 dark:text-slate-400 text-sm">language</span>
        <select id="language-select" class="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded px-2 py-1 cursor-pointer">
          <option value="en" data-lang="en">English</option>
          <option value="hi" data-lang="hi">हिन्दी</option>
          <option value="mr" data-lang="mr">मराठी</option>
        </select>
      </div>
      <button onclick="toggleLanguageSelector()" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <span class="material-icons text-sm">close</span>
      </button>
    </div>
    <div class="language-selector-backdrop fixed inset-0 bg-black/50 z-40 hidden" onclick="closeLanguageSelector()"></div>
  `;
}

// Initialize language selector on page
function initLanguageSelector() {
  // Remove existing selector if any
  const existingSelector = document.querySelector('.language-selector');
  if (existingSelector) {
    existingSelector.remove();
  }
  
  // Add new selector to body
  const selectorHTML = createLanguageSelector();
  document.body.insertAdjacentHTML('beforeend', selectorHTML);
  
  // Set current language
  const select = document.getElementById('language-select');
  if (select) {
    select.value = currentLanguage;
    select.addEventListener('change', function() {
      setLanguage(this.value);
      closeLanguageSelector();
    });
  }
}

// Toggle language selector visibility
function toggleLanguageSelector() {
  const selector = document.querySelector('.language-selector');
  const backdrop = document.querySelector('.language-selector-backdrop');
  
  if (selector && backdrop) {
    const isHidden = selector.classList.contains('hidden');
    if (isHidden) {
      selector.classList.remove('hidden');
      backdrop.classList.add('hidden');
    } else {
      selector.classList.add('hidden');
      backdrop.classList.remove('hidden');
    }
  }
}

// Close language selector
function closeLanguageSelector() {
  const selector = document.querySelector('.language-selector');
  const backdrop = document.querySelector('.language-selector-backdrop');
  
  if (selector && backdrop) {
    selector.classList.add('hidden');
    backdrop.classList.add('hidden');
  }
}

// Add language selector button to navigation (skip if main dropdown already present)
// Places the button on the far right of the nav.
function addLanguageButtonToNav() {
  if (document.getElementById('lang-dropdown')) return;
  const nav = document.querySelector('nav') || document.querySelector('header');
  if (nav) {
    const existingBtn = nav.querySelector('[data-lang-selector-btn]');
    if (!existingBtn) {
      const langBtn = document.createElement('button');
      langBtn.setAttribute('data-lang-selector-btn', 'true');
      langBtn.className = 'w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';
      langBtn.innerHTML = `
        <span class="material-icons text-sm">language</span>
      `;
      langBtn.title = getTranslation('common.select_language') || 'Select Language';
      langBtn.onclick = toggleLanguageSelector;
      langBtn.setAttribute('aria-label', 'Select language');

      const themeBtn = nav.querySelector('[onclick*="toggleTheme"]');
      const rightContainer = themeBtn ? themeBtn.parentElement : nav;
      rightContainer.appendChild(langBtn);
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Add language selector button to navigation
  setTimeout(() => {
    addLanguageButtonToNav();
  }, 100);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + L to open language selector
  if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault();
    toggleLanguageSelector();
  }
  // Escape to close language selector
  if (e.key === 'Escape') {
    closeLanguageSelector();
  }
});
