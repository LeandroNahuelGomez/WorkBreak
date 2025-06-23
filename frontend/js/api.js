const API_BASE_URL = 'http://localhost:3000/api/v1/';

export const apiClient = {
    async fetchAPI(endpoint, options = {}) {
        try {
            const fullUrl = `${API_BASE_URL}${endpoint}`;
            const response = await fetch(fullUrl, {
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                ...options,
            });

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
            throw new Error(`Error al conectar con el API: ${error.message}`);
        }
    }
};
