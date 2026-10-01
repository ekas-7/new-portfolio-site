export const THEME_STORAGE_KEY = "theme";

/** Runs before hydration so the stored (or system) theme is applied without a flash. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t}catch(e){}})()`;
