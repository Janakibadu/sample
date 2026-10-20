import { useEffect } from 'react';

// Applies a class to <body> for the lifetime of the page, matching the old
// per-page <body class="..."> markup (theme.css keys off of it).
export default function useBodyClass(className) {
  useEffect(() => {
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, [className]);
}
