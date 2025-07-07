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

    // Titulo y ubicación
    document.querySelector("title").textContent = `${producto.titulo} - WorkBreak`;
    document.querySelector("h1").textContent = producto.titulo;
    const ubicacion = producto.ubicacion || "Ubicación no disponible";
    document.querySelector(".info-section p").innerHTML = `<i class='fas fa-map-marker-alt'></i> ${ubicacion}`;

    // Descripción y normas
    document.querySelector(".description p").textContent = producto.normas || "Sin descripción detallada.";

    // Precio y desglose
    //Esto traer desde bd precioxhora tendria que ser
    const pricePerNight = parseFloat(producto.precio_hora) || 50;
    const nights = 2;
    const limpieza = 10;
    const servicio = 5;
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
    mainImg.style.backgroundImage = `url('${producto.imagen || "https://source.unsplash.com/featured/?workspace"}')`;

    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach((thumb, i) => {
      const imagenes = producto.imagenes || [];
      thumb.style.backgroundImage = `url('${imagenes[i] || producto.imagen || "https://source.unsplash.com/random/200x200?office"}')`;
    });

  } catch (err) {
    console.error("Error al cargar el producto:", err);
    alert("Error al cargar el producto");
  }
});


document.getElementById("form-reserva").addEventListener("submit", (e) => {
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

  // Guardar reserva en localStorage (puede adaptarse a API POST si tenés backend)
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  const nuevaReserva = {
    producto_id: producto.producto_id,
    titulo: producto.titulo,
    imagen: producto.imagen,
    //Cantidad de personas este mal hecho lo tenemos que traer desde el select option
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

//   Redirigir
  window.location.href = "../pages/dashboard-user.html";
});
