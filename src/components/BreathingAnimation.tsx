import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

interface BreathingAnimationProps {
  phase: 'inhale' | 'holdIn' | 'exhale' | 'holdOut';
  progress: number; // 0 to 1
  color: string;
  isActive: boolean;
}

const BreathingAnimation: React.FC<BreathingAnimationProps> = ({ 
  phase, 
  progress, 
  color,
  isActive
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkMode } = useAppContext();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match display size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate radius based on phase and progress
    let minRadius = Math.min(rect.width, rect.height) * 0.1;
    let maxRadius = Math.min(rect.width, rect.height) * 0.4;
    
    let currentRadius;
    let opacity = 0.7;
    
    switch (phase) {
      case 'inhale':
        currentRadius = minRadius + (maxRadius - minRadius) * progress;
        break;
      case 'holdIn':
        currentRadius = maxRadius;
        opacity = 0.7 + (0.3 * Math.sin(progress * Math.PI));
        break;
      case 'exhale':
        currentRadius = maxRadius - (maxRadius - minRadius) * progress;
        break;
      case 'holdOut':
        currentRadius = minRadius;
        opacity = 0.7 + (0.2 * Math.sin(progress * Math.PI));
        break;
    }
    
    // Draw breathing circle
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, currentRadius * 1.5
    );
    
    // Parse the hex color to rgba
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    const rgb = hexToRgb(color);
    
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);
    gradient.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.7})`);
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add subtle pulsing effect when holding
    if ((phase === 'holdIn' || phase === 'holdOut') && isActive) {
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 + 0.2 * Math.sin(Date.now() / 300)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius + 5 * Math.sin(Date.now() / 300), 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Display phase text
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = isDarkMode ? '#FFFFFF' : '#374151';
    
    let phaseText;
    switch (phase) {
      case 'inhale': phaseText = 'Inhale'; break;
      case 'holdIn': phaseText = 'Hold'; break;
      case 'exhale': phaseText = 'Exhale'; break;
      case 'holdOut': phaseText = 'Hold'; break;
    }
    
    ctx.fillText(phaseText, centerX, centerY + currentRadius + 30);
    
  }, [phase, progress, color, isActive, isDarkMode]);
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default BreathingAnimation;