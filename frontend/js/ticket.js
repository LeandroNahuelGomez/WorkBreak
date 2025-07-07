
document.addEventListener("DOMContentLoaded", async () => {
    // Nombre del cliente - suponemos que está en localStorage bajo "nombreCliente"
    const nombreCliente = localStorage.getItem("nombreUsuario") || "Cliente Anónimo";

    // Fecha de hoy formateada (dd/mm/yyyy)
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString("es-AR");

    // Obtener reservas
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    console.log(reservas);

    // Tomamos la primera reserva para mostrar en el ticket
    const reserva = reservas.length > 0 ? reservas[0] : null;

    // Poner datos en el HTML
    document.getElementById("nombre-cliente").textContent = nombreCliente;
    document.getElementById("fecha-hoy").textContent = fechaFormateada;

    const contenedorReservas = document.getElementById("producto-info");

    if (reservas.length === 0) {
        contenedorReservas.innerHTML = "<p>No hay reservas.</p>";
    } else {
        let contenido = "<h2>Productos Comprados</h2>";

        const diaReservaDate = new Date(reserva.diaReserva)
        const fechaFormateada = diaReservaDate.toLocaleDateString('es-AR');

        reservas.forEach((reserva, index) => {
            contenido += `
                    <div class="reserva-bloque">
                        <p><strong>Reserva ${index + 1}</strong></p>
                        <p><strong>Título:</strong> ${reserva.titulo}</p>
                        <p><strong>Fecha reserva:</strong> ${fechaFormateada}</p>
                        <p><strong>Duración:</strong> ${reserva.duracionHoras} hs</p>
                        <p><strong>Total a pagar:</strong> $${reserva.monto_total}</p>
                        <hr>
                    </div>
                `;
        });

        contenedorReservas.innerHTML = contenido;
    }

    // ✅ ENVIAR reservas a la BD
    try {
        for (const reserva of reservas) {
            const reservaId = localStorage.getItem("reserva_id_creada");
            console.log("ID de reserva obtenido de localStorage:", reservaId);

            if (!reservaId) {
                console.error("No se encontró reserva_id en localStorage");
                return;
            }

            const id_reserva = parseInt(reservaId);
            

            // Armar objeto compatible con la API
            const datosParaEnviar = {
                    reserva_id: id_reserva,
                    nombre_usuario: reserva.nombreUsuario || "Usuario Anónimo",
            };

            console.log('Datos a enviar:', datosParaEnviar);

            const respuesta = await apiClient.fetchAPI('ticket', {
                method: 'POST',
                body: JSON.stringify(datosParaEnviar)
            });

            console.log("Ticket enviado correctamente:", respuesta);
        }
    } catch (error) {
        console.error("Error al enviar reservas a la base de datos:", error.message);
    }


    // Botón para volver a reservas
    document.getElementById("btn-volver").addEventListener("click", async () => {
        const ticket = document.getElementById("ticket");
        const boton = document.getElementById("btn-volver");


        // Ocultar el botón antes de capturar
        boton.style.display = "none";

        // Esperá un momento para que el DOM se actualice
        await new Promise(resolve => setTimeout(resolve, 100));

        // Capturar con html2canvas
        const canvas = await html2canvas(ticket, {
            scale: 2
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new window.jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`ticket_${Date.now()}.pdf`);

        localStorage.clear();
        window.location.href = "login-user.html";
    });

});