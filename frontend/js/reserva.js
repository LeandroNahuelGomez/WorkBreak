document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-reservas");
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    if (reservas.length === 0) {
        contenedor.innerHTML = "<p>No tenés reservas todavía.</p>";
        return;
    }

    reservas.forEach((res) => {
        const card = document.createElement("div");
        card.className = "reserva-card";
        card.innerHTML = `
  <div class="reserva-info">
    <h3>${res.titulo}</h3>
    <p><strong>Fecha:</strong> ${res.diaReserva}</p>
    <p><strong>Desde:</strong> ${res.horaEntrada} - <strong>Hasta:</strong> ${res.horaSalida}</p>
    <p><strong>Duración:</strong> <span class="duracion">${res.duracionHoras}</span> hs</p>
    <p><strong>Total:</strong> $<span class="total">${res.monto_total}</span></p>
    
    <div class="card-footer">
      <div class="btn-group">
        <button class="btn-hora menos">- 1h</button>
        <button class="btn-hora mas">+ 1h</button>
        <button class="btn-eliminar">Eliminar</button>
      </div>
    </div>
  </div>
  <img src="../img/productos/${res.imagen}" alt="${res.titulo}">
`;

        contenedor.appendChild(card);
        // Selección de elementos
        const btnEliminar = card.querySelector(".btn-eliminar");
        const btnMas = card.querySelector(".mas");
        const btnMenos = card.querySelector(".menos");
        const duracionSpan = card.querySelector(".duracion");
        const totalSpan = card.querySelector(".total");

        // Eliminar reserva
        btnEliminar.addEventListener("click", () => {
            const nuevasReservas = reservas.filter(r => !(r.titulo === res.titulo && r.fecha === res.fecha));
            localStorage.setItem("reservas", JSON.stringify(nuevasReservas));
            location.reload(); // Recarga para actualizar visualmente
        });

        // Aumentar duración
        btnMas.addEventListener("click", () => {
            res.duracionHoras += 1;
            res.total = res.duracionHoras * res.precioHora;
            duracionSpan.textContent = res.duracionHoras;
            totalSpan.textContent = res.total;
            actualizarReserva(reservas, res);
        });

        // Disminuir duración
        btnMenos.addEventListener("click", () => {
            if (res.duracionHoras > 1) {
                res.duracionHoras -= 1;
                res.total = res.duracionHoras * res.precioHora;
                duracionSpan.textContent = res.duracionHoras;
                totalSpan.textContent = res.total;
                actualizarReserva(reservas, res);
            }
        });
    });

    const btnFinalizar = document.getElementById("btn-finalizar");

    btnFinalizar.addEventListener("click", async () => {
        // Obtener las reservas desde localStorage
        const reservasStr = localStorage.getItem('reservas');
        console.log('Reservas a enviar:', reservasStr);

        if (!reservasStr) {
            alert("No hay reservas para enviar.");
            return;
        }

        let reservas;

        try {
            reservas = JSON.parse(reservasStr);
            console.log('Reservas parseadas:', reservas);
        } catch {
            alert("Error al leer las reservas guardadas.");
            return;
        }

        if (!Array.isArray(reservas) || reservas.length === 0) {
            alert("No hay reservas válidas para enviar.");
            return;
        }

        try {
            // Pero si tu API sólo acepta una por vez, hacés un loop:
            for (const reservaData of reservas) {
                console.log(reservaData.nombreUsuario);
                // CONVERSIÓN: Ajustar los datos antes de enviar
                const diaReservaDate = new Date(reservaData.diaReserva); // Asegura que sea objeto Date
                const montoTotal = parseFloat(reservaData.monto_total || reservaData.total);
                const cantPersonas = parseInt(reservaData.cantidad_personas || reservaData.cantPersonas);

                // Armar objeto compatible con la API
                const datosParaEnviar = {
                    producto_id: parseInt(reservaData.producto_id), // o reservaData.producto_id si ya lo tenés así
                    dia_reserva: diaReservaDate,
                    hora_llegada: reservaData.horaEntrada,
                    hora_salida: reservaData.horaSalida,
                    cantidad_personas: cantPersonas,
                    monto_total: montoTotal,
                    nombre_usuario: reservaData.nombreUsuario
                };

                console.log('Datos a enviar:', datosParaEnviar);

                const reservaCreada = await apiClient.fetchAPI('reserva', {
                    method: 'POST',
                    body: JSON.stringify(datosParaEnviar)
                });

                localStorage.setItem("reserva_id_creada", reservaCreada.reserva_id);
            }

            console.log('Todas las reservas guardadas con éxito.');
            // Limpiar reservas para evitar reenviar
            // localStorage.removeItem('reservas');

            // Redirigir a ticket o página confirmación
            window.location.href = "../../frontend/pages/ticket.html";

        } catch (error) {
            console.error('Error al guardar reservas:', error.message);
            alert("Error al guardar las reservas. Por favor, intente nuevamente.");
        }
    });

});


// Función para actualizar la reserva en localStorage
function actualizarReserva(reservas, reservaActualizada) {
    const index = reservas.findIndex(r => r.titulo === reservaActualizada.titulo && r.fecha === reservaActualizada.fecha);
    if (index !== -1) {
        reservas[index] = reservaActualizada;
        localStorage.setItem("reservas", JSON.stringify(reservas));
    }
}