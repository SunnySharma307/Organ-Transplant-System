import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:8000';

class ApiClient {
    async get(endpoint: string) {
        return this.request(endpoint, 'GET');
    }

    async post(endpoint: string, body: any) {
        return this.request(endpoint, 'POST', body);
    }

    private async request(endpoint: string, method: string, body?: any) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (auth?.currentUser) {
            const token = await auth.currentUser.getIdToken();
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API Error: ${response.statusText}`);
        }

        return response.json();
    }
    async getWaitlist() {
        return this.get('/registry/waitlist');
    }

    async getInventory() {
        return this.get('/registry/inventory');
    }
}

export const api = new ApiClient();
