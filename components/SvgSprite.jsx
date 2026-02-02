'use client';

import { useEffect } from 'react';

const SvgSprite = () => {
  useEffect(() => {
    // Function to load SVG sprite
    const loadSvgSprite = async () => {
      try {
        const response = await fetch('/icons.svg');
        const svgText = await response.text();
        
        // Create a div to hold the SVG sprite (hidden)
        const spriteContainer = document.createElement('div');
        spriteContainer.style.display = 'none';
        spriteContainer.innerHTML = svgText;
        
        // Insert at the beginning of body
        document.body.insertBefore(spriteContainer, document.body.firstChild);
      } catch (error) {
        console.error('Failed to load SVG sprite:', error);
      }
    };

    // Only load if not already loaded
    if (!document.querySelector('svg defs')) {
      loadSvgSprite();
    }
  }, []);

  return null; // This component doesn't render anything visible
};

export default SvgSprite; 