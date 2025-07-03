async function cargarReservas() {
    const tabla = document.getElementById("tablaReservas");
    const tbody = tabla.querySelector("tbody");

    try {
        const token = localStorage.getItem("token");

        if (!token) {
            // Redirigir al login si no hay token
            window.location.href = "login-admin.html";
            return;
        }


        const res = await apiClient.fetchAPI("reservas", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Respuesta de API reservas:", res);

        const reservas = Array.isArray(res) ? res : res.reservas; // por si viene { reservas: [...] }

        reservas.forEach(r => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${r.reserva_id}</td>
                <td>${r.producto_id}</td>
                <td>${r.fecha_inicio}</td>
                <td>${r.fecha_fin}</td>
                <td>${r.cantidad_personas}</td>
                <td>${r.estado}</td>
                <td>${r.monto_total}</td>
                <td>${r.metodo_pago_id}</td>
                <td>${r.fecha_reserva}</td>
                <td>
                    <button class="btn btn-sm btn-primary">Editar</button>
                    <button class="btn btn-sm btn-danger">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        tabla.classList.remove("d-none");
        document.querySelector("#divListadoReservas .spinner-border")?.remove();
    } catch (error) {
        console.error("Error al cargar reservas:", error.message);
        document.querySelector("#divListadoReservas").innerHTML = `
            <div class="alert alert-danger">Error al cargar reservas: ${error.message}</div>
        `;
    }
}

