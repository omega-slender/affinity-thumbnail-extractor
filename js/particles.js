(function() {
    'use strict';

    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    let displayWidth = 0;
    let displayHeight = 0;
    let dpr = 1;
    
    const CONFIG = {
        particleCount: 50,
        particleMinSize: 1,
        particleMaxSize: 3,
        particleMinSpeed: 0.2,
        particleMaxSpeed: 0.8,
        particleColor: 'rgba(255, 255, 255, 0.6)',
        lineColor: 'rgba(255, 255, 255, 0.1)',
        lineDistance: 120,
        mouseRadius: 150
    };

    let particles = [];
    let animationId = null;
    let mouse = { x: null, y: null };
    let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * displayWidth;
            this.y = Math.random() * displayHeight;
            this.size = Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize) + CONFIG.particleMinSize;
            this.speedX = (Math.random() - 0.5) * (CONFIG.particleMaxSpeed - CONFIG.particleMinSpeed) + CONFIG.particleMinSpeed;
            this.speedY = (Math.random() - 0.5) * (CONFIG.particleMaxSpeed - CONFIG.particleMinSpeed) + CONFIG.particleMinSpeed;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = displayWidth;
            if (this.x > displayWidth) this.x = 0;
            if (this.y < 0) this.y = displayHeight;
            if (this.y > displayHeight) this.y = 0;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONFIG.mouseRadius) {
                    const force = (CONFIG.mouseRadius - distance) / CONFIG.mouseRadius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x * dpr, this.y * dpr, this.size * dpr, 0, Math.PI * 2);
            ctx.fillStyle = CONFIG.particleColor.replace('0.6', this.opacity.toString());
            ctx.fill();
        }
    }

    function resizeCanvas() {
        dpr = window.devicePixelRatio || 1;
        
        displayWidth = window.innerWidth;
        displayHeight = window.innerHeight;
        
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
    }

    function initParticles() {
        particles = [];
        const count = isReducedMotion ? 20 : CONFIG.particleCount;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONFIG.lineDistance) {
                    const opacity = (1 - distance / CONFIG.lineDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x * dpr, particles[i].y * dpr);
                    ctx.lineTo(particles[j].x * dpr, particles[j].y * dpr);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5 * dpr;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        if (!isReducedMotion) {
            drawConnections();
        }

        animationId = requestAnimationFrame(animate);
    }

    function handleMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    function handleMouseLeave() {
        mouse.x = null;
        mouse.y = null;
    }

    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initParticles();
        }, 250);
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    }

    function init() {
        resizeCanvas();
        initParticles();

        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            isReducedMotion = e.matches;
            initParticles();
        });

        animate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
