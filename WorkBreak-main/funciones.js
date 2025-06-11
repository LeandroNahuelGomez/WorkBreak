// =============================
// Código principal para interactividad y eventos DOM
// =============================
document.addEventListener('DOMContentLoaded', () => {
  const filterItems = document.querySelectorAll('.filter-item');
  filterItems.forEach(item => {
    item.addEventListener('click', () => {
      filterItems.forEach(f => f.classList.remove('active'));
      item.classList.add('active');
      filtrarEspacios(item.textContent.trim());
    });
  });

  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const button = searchForm.querySelector('.search-btn');
      const originalText = button.textContent;
      button.innerHTML = '<div class="loading"></div> Buscando...';
      setTimeout(() => {
        button.textContent = originalText;
        alert('Funcionalidad de búsqueda no implementada todavía.');
      }, 2000);
    });
  }

  const workspaceCards = document.querySelectorAll('.workspace-card');
  workspaceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      card.style.transition = 'transform 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  const bookBtns = document.querySelectorAll('.book-btn');
  bookBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const originalText = btn.textContent;
      btn.textContent = 'Redirigiendo...';
      btn.disabled = true;
      abrirDetalleEspacio(btn.closest('.workspace-card'));
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    });
  });
});

// =============================
// Filtrar espacios por categoría
// =============================
function filtrarEspacios(categoria) {
  const espacios = document.querySelectorAll('.workspace-card');
  const cat = categoria.toLowerCase();

  espacios.forEach(espacio => {
    if (cat === 'todos') {
      espacio.style.display = 'block';
      return;
    }

    const rating = (espacio.getAttribute('data-rating') || '').toLowerCase();
    const amenities = (espacio.getAttribute('data-amenities') || '').toLowerCase();
    const location = (espacio.getAttribute('data-location') || '').toLowerCase();

    let mostrar = false;

    switch (cat) {
      case '5 estrellas':
        mostrar = rating.includes('★★★★★') || rating.includes('5 estrellas');
        break;
      case '4 estrellas':
        mostrar = rating.includes('★★★★') || rating.includes('4 estrellas');
        break;
      case 'con desayuno':
        mostrar = amenities.includes('desayuno');
        break;
      case 'wifi gratis':
        mostrar = amenities.includes('wifi');
        break;
      case 'piscina':
        mostrar = amenities.includes('piscina');
        break;
      case 'cerca del centro':
        mostrar = location.includes('centro');
        break;
      default:
        mostrar = true;
    }

    espacio.style.display = mostrar ? 'block' : 'none';
  });
}

// =============================
// Abrir detalle en nueva pestaña
// =============================
function abrirDetalleEspacio(card) {
  if (!card) return;

  const nombre = card.querySelector('.workspace-name')?.textContent.trim() || '';
  const ubicacion = card.querySelector('.workspace-location')?.textContent.trim() || '';
  const precio = card.querySelector('.price-current')?.textContent.replace('ARS ', '').trim() || '';
  const amenities = Array.from(card.querySelectorAll('.workspace-amenities .amenity'))
    .map(el => el.textContent.trim())
    .join(', ');
  const rating = card.getAttribute('data-rating')?.trim() || '';
  const precioAntiguo = card.querySelector('.price-old')?.textContent.trim() || '';

  const urlParams = new URLSearchParams({
    nombre,
    ubicacion,
    precio,
    amenities,
    rating,
    precioAntiguo
  });

  const url = `detalle.html?${urlParams.toString()}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// =============================
// Código para carrito de reservas (detalle.html)
// =============================
document.addEventListener('DOMContentLoaded', () => {
  const btnReservar = document.querySelector('.btn-reservar');
  const form = document.querySelector('.booking-form form');

  if (!btnReservar || !form) return;

  btnReservar.addEventListener('click', e => {
    e.preventDefault();

    const espacio = obtenerDatosDesdeURL();

    const checkin = form.querySelector('#checkin').value;
    const checkout = form.querySelector('#checkout').value;
    const guests = form.querySelector('#guests').value;

    if (!checkin || !checkout) {
      alert('Por favor, seleccioná fechas de llegada y salida.');
      return;
    }

    if (new Date(checkin) >= new Date(checkout)) {
      alert('La fecha de salida debe ser posterior a la de llegada.');
      return;
    }

    const guestsCount = parseInt(guests);
    if (isNaN(guestsCount) || guestsCount < 1) {
      alert('Por favor, seleccioná una cantidad válida de huéspedes.');
      return;
    }

    const noches = Math.round((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    const precioPorNoche = espacio.precio || 0;
    const tarifaLimpieza = 10;
    const tarifaServicio = 5;

    const subtotal = precioPorNoche * noches;
    const total = subtotal + tarifaLimpieza + tarifaServicio;

    const reserva = {
      ...espacio,
      checkin,
      checkout,
      guests: guestsCount,
      noches,
      precioPorNoche,
      tarifaLimpieza,
      tarifaServicio,
      total,
      fechaReserva: new Date().toISOString(),
      id: Date.now()
    };

    agregarAlCarrito(reserva);
  });
});

function obtenerCarrito() {
  const carritoJSON = localStorage.getItem('carritoReservas');
  return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carritoReservas', JSON.stringify(carrito));
}

function agregarAlCarrito(espacio) {
  if (!espacio || !espacio.nombre) {
    alert('Error: datos inválidos para agregar al carrito.');
    return;
  }
  const carrito = obtenerCarrito();
  carrito.push(espacio);
  guardarCarrito(carrito);
  alert(`¡Se agregó "${espacio.nombre}" al carrito!`);
}

function obtenerDatosDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    nombre: params.get('nombre') || '',
    ubicacion: params.get('ubicacion') || '',
    precio: parseFloat(params.get('precio')) || 0,
    amenities: params.get('amenities') || '',
    rating: params.get('rating') || '',
    precioAntiguo: params.get('precioAntiguo') || ''
  };
}
