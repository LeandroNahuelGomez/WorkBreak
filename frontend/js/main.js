// Ejemplo de GET
apiClient.fetchAPI('usuarios')
    .then(data => console.log(data))
    .catch(error => console.error(error));

// Ejemplo de POST
apiClient.fetchAPI('usuarios', {
    method: 'POST',
    body: JSON.stringify({ name: 'John Doe' })
});