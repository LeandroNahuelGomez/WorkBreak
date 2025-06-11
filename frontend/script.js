// Cambiar imagen principal al hacer clic en thumbnail
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.querySelector('.main-image');

thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
        const thumbBg = thumb.style.backgroundImage;
        mainImage.style.backgroundImage = thumbBg;
        
        // Efecto visual
        mainImage.style.transform = 'scale(1.03)';
        setTimeout(() => {
            mainImage.style.transform = 'scale(1)';
        }, 300);
    });
});

// Animación al reservar
document.querySelector('.reserve-btn').addEventListener('click', (e) => {
    e.preventDefault();
    
    const btn = e.target;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    btn.style.opacity = '0.8';
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Reservado!';
        btn.style.background = '#4CAF50';
        
        // Confeti simulado (efecto visual)
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.top = '0';
        confetti.style.left = '0';
        confetti.style.width = '100%';
        confetti.style.height = '100%';
        confetti.style.background = 'url(https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif) center/cover';
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }, 1500);
});