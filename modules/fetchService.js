class FetchService {
    async request(url, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        try {
            const response = await fetch(url, options);
            let data = null;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            }
            return { data, status: response.status };
        } catch (error) {
            console.error('Fetch error:', error);
            return { data: null, status: 0 };
        }
    }

    async get(url) {
        return this.request(url, 'GET');
    }

    async post(url, body) {
        return this.request(url, 'POST', body);
    }

    async patch(url, body) {
        return this.request(url, 'PATCH', body);
    }

    async delete(url) {
        return this.request(url, 'DELETE');
    }
}

export const fetchService = new FetchService();
