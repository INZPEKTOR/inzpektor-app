import { useEffect, useRef } from 'react';
import './FloatingCharsBackground.css';

const FloatingCharsBackground = () => {
  const containerRef = useRef(null);

  // Generate characters: A-Z and 0-9
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const numChars = 50; // Number of floating characters

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear existing characters
    containerRef.current.innerHTML = '';

    // Create floating characters
    for (let i = 0; i < numChars; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const charElement = document.createElement('div');
      charElement.className = 'floating-char';
      charElement.textContent = char;
      
      // Random properties for each character
      const size = Math.random() * 20 + 12; // 12-32px
      const left = Math.random() * 100; // 0-100%
      const animationDuration = Math.random() * 20 + 15; // 15-35s
      const animationDelay = Math.random() * 5; // 0-5s
      const opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4
      const blur = Math.random() * 2; // 0-2px
      const drift = (Math.random() - 0.5) * 2; // -1 to 1 for horizontal drift
      const rotation = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25 for slight rotation
      
      // Apply styles
      charElement.style.fontSize = `${size}px`;
      charElement.style.left = `${left}%`;
      charElement.style.animationDuration = `${animationDuration}s`;
      charElement.style.animationDelay = `${animationDelay}s`;
      charElement.style.opacity = opacity;
      charElement.style.filter = `blur(${blur}px)`;
      charElement.style.setProperty('--drift', drift);
      charElement.style.setProperty('--rotation', rotation);
      
      // Random starting position (top)
      charElement.style.top = `${Math.random() * 20 - 10}%`;
      
      containerRef.current.appendChild(charElement);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="floating-chars-container"
      aria-hidden="true"
    />
  );
};

export default FloatingCharsBackground;

