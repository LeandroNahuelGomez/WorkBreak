document.getElementById('getUsers').addEventListener('click', async () => {
    try {
        const users = await apiClient.fetchAPI('usuarios');
        console.log('Usuarios:', users);
        alert('Datos obtenidos! Revisa la consola');
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        alert('Error al obtener usuarios');
    }
});

document.getElementById('createUser').addEventListener('click', async () => {
    try {
        const newUser = await apiClient.fetchAPI('usuarios', {
            method: 'POST',
            body: JSON.stringify({ name: 'John Doe' })
        });
        console.log('Usuario creado:', newUser);
        alert('Usuario creado! Revisa la consola');
    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert('Error al crear usuario');
    }
});