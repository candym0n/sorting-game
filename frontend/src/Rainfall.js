import { useEffect, useRef } from 'react';

const Rainfall = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial resize
    resizeCanvas();

    // Listen for window resize
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = "10";
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    
    // Array to track the y position of each column
    const drops = new Array(columns).fill(0);

    // Drawing function
    const draw = () => {
      // Black semi-transparent background to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      // Loop over drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw the character
        ctx.fillText(
          char,
          i * fontSize,
          drops[i] * fontSize
        );

        // Reset drop to top with random delay when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Increment y coordinate
        drops[i]++;
      }

      // Create leading brighter characters
      for (let i = 0; i < drops.length; i++) {
        if (drops[i] * fontSize < canvas.height) {
          ctx.fillStyle = '#FFF';
          const char = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(
            char,
            i * fontSize,
            drops[i] * fontSize
          );
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default Rainfall;
