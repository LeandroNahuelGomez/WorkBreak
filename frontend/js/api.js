window.API_BASE_URL = 'http://localhost:3000/api/v1/';

window.apiClient = {
    async fetchAPI(endpoint, options = {}) {
        try {
            const fullUrl = `${window.API_BASE_URL}${endpoint}`;
            console.log(`Enviando petición a: ${fullUrl}`); // Log para depuración
            
            const response = await fetch(fullUrl, {
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers
                },
                ...options
            });

            // Verifica si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Respuesta no JSON: ${text.substring(0, 100)}`);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error("Detalle completo del error:", error);
            throw new Error(`Error al conectar con el API: ${error.message}`);
        }
    }
};
