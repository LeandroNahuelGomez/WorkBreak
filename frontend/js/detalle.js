let producto;

// detalle.js (corregido y funcional)
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("No se especificó un producto");
    return;
  }

  try {
    producto = await apiClient.fetchAPI(`productos/${id}`);
    // ubicaciones = await apiClient.fetchAPI(`ubicacion/`);

    // Buscar la ubicación que coincida con el producto_id
    // const ubicacionCoincidente = ubicaciones.find(u => u.producto_id === producto.producto_id);

    // Titulo y ubicación
    document.querySelector("title").textContent = `${producto.titulo} - WorkBreak`;
    document.querySelector("h1").textContent = producto.titulo;
    document.querySelector(".info-section p").innerHTML = `<i class='fas fa-map-marker-alt'></i> ${"Ciudad no disponible"}`;

    // Descripción y normas
    document.querySelector(".description p").textContent = producto.normas || "Sin descripción detallada.";

    // Precio y desglose
    //Esto traer desde bd precioxhora tendria que ser
    const pricePerNight = parseFloat(producto.precio_hora) || 50;
    const nights = 2;
    const limpieza = 0;
    const servicio = 0;
    const subtotal = pricePerNight * nights;
    const total = subtotal + limpieza + servicio;

    document.querySelector(".price-section h3").innerHTML = `$${pricePerNight} <span>USD / hora</span>`;

    const breakdown = document.querySelector(".price-breakdown");
    breakdown.innerHTML = `
      <div class="price-row"><span>$${pricePerNight} x ${nights} noches</span><span>$${subtotal}</span></div>
      <div class="price-row"><span>Tarifa de limpieza</span><span>$${limpieza}</span></div>
      <div class="price-row"><span>Tarifa de servicio</span><span>$${servicio}</span></div>
      <div class="price-row total"><strong>Total</strong><strong>$${total}</strong></div>
    `;

    // Imagen principal y thumbnails
    const mainImg = document.querySelector(".main-image");
    const imagen = "../../backend/db/image/1696536427-coworking-spaces-hybrid-world-1023-g1437209221.jpg";
    mainImg.style.backgroundImage = `url('${imagen}')`;


  } catch (err) {
    console.error("Error al cargar el producto:", err);
    alert("Error al cargar el producto");
  }
});

// Función para verificar disponibilidad
async function verificarDisponibilidad(producto_id, fecha, hora_entrada, hora_salida) {
  try {
    const params = new URLSearchParams({
      producto_id: producto_id,
      fecha: fecha,
      hora_entrada: hora_entrada,
      hora_salida: hora_salida
    });

    const response = await apiClient.fetchAPI(`reserva/disponibilidad?${params.toString()}`);
    return response;
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
    throw error;
  }
}


document.getElementById("form-reserva").addEventListener("submit", async (e) => {
  e.preventDefault();

  const diaReserva = document.getElementById("fecha").value;
  const horaEntrada = document.getElementById("hora-entrada").value;
  const horaSalida = document.getElementById("hora-salida").value;
  const cantidadPersonas = document.getElementById("cantidad-personas").value;

  if (!diaReserva || !horaEntrada || !horaSalida) {
    console.log("Completá todos los campos");
    return;
  }

  const llegada = new Date(`${diaReserva}T${horaEntrada}`);
  const salida = new Date(`${diaReserva}T${horaSalida}`);
  const duracionHoras = (salida - llegada) / (1000 * 60 * 60);

  if (duracionHoras <= 0) {
    alert("La hora de salida debe ser posterior a la de entrada");
    return;
  }

  // Mostrar loader o deshabilitar botón mientras se verifica
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Verificando disponibilidad...";

  try {
    // Verificar disponibilidad antes de procesar la reserva
    const disponibilidad = await verificarDisponibilidad(
      producto.producto_id,
      diaReserva,
      horaEntrada,
      horaSalida
    );

    console.log("Disponibilidad:", disponibilidad);

    if (!disponibilidad.disponible) {
      // Mostrar el modal con el mensaje
      const modalBody = document.getElementById("modalConflictoBody");
      modalBody.textContent = "Horario no disponible. Por favor, elige otro dia u horario.";

      const modal = new bootstrap.Modal(document.getElementById('modalConflicto'));
      modal.show();
      return;
    }

    // Si está disponible, proceder con la reserva
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    const nuevaReserva = {
      producto_id: producto.producto_id,
      titulo: producto.titulo,
      imagen: producto.imagen,
      cantidad_personas: cantidadPersonas,
      diaReserva,
      horaEntrada,
      horaSalida,
      duracionHoras,
      precioHora: producto.precio_hora,
      monto_total: duracionHoras * producto.precio_hora,
      nombreUsuario: localStorage.getItem("nombreUsuario") || "Usuario Anónimo"
    };

    reservas.push(nuevaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    // Redirigir solo si la reserva fue exitosa
    window.location.href = "../pages/dashboard-user.html";

  } catch (error) {
    console.error("Error al procesar la reserva:", error);
    alert("Error al procesar la reserva. Por favor, intenta nuevamente.");
  } finally {
    // Restaurar el botón
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});


document.getElementById('volverAtras-btn').addEventListener('click', function (e) {
  e.preventDefault();

  // Redirigir a login
  window.location.href = 'dashboard-user.html';
});

document.addEventListener('DOMContentLoaded', function () {
  // Obtener el valor del localStorage o establecer por defecto
  const darkMode = localStorage.getItem('darkMode') === 'true';

  // Aplicar el tema inicial
  setTheme(darkMode);

  // Configurar el botón de alternancia (si existe)
  setupThemeToggle();
});

function setTheme(isDark) {
  // Aplicar/remover la clase dark-mode al body
  document.body.classList.toggle('dark-mode', isDark);

  // Actualizar el localStorage
  localStorage.setItem('darkMode', isDark);
}

function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isDark = !document.body.classList.contains('dark-mode');
      setTheme(isDark);
    });
  }
}

document.getElementById("volverAtras-btn").addEventListener("click", () => {
  window.location.href = "../pages/dashboard-user.html"; // Cambialo por el destino deseado
});