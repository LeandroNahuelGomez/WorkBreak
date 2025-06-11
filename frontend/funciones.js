
// Simple interactivity
document.addEventListener('DOMContentLoaded', function () {
    // Filter functionality
    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.addEventListener('click', function () {
            filterItems.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Form submission
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const button = this.querySelector('.search-btn');
        const originalText = button.textContent;
        button.innerHTML = '<div class="loading"></div> Buscando...';

        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });

    // Hotel card hover effects
    const hotelCards = document.querySelectorAll('.hotel-card');
    hotelCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Booking buttons
    const bookBtns = document.querySelectorAll('.book-btn');
    bookBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const originalText = this.textContent;
            this.textContent = 'Redirigiendo...';
            this.disabled = true;

            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                alert('Redirigiendo a la página de reserva...');
            }, 1500);
        });
    });
})