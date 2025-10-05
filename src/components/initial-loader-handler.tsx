'use client';

import { useEffect } from 'react';

export function InitialLoaderHandler() {
  useEffect(() => {
    // Hide initial loader once React has mounted
    const loader = document.getElementById('initial-loader');
    if (loader) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }, 200);
    }
  }, []);

  return null;
}