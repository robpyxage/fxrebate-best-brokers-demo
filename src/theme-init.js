// Apply the demo theme before paint; production should use its existing theme provider.
(()=>{let theme;try{theme=localStorage.getItem('fxrebate-demo-theme');}catch{}if(theme!=='dark'&&theme!=='light')theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;})();
