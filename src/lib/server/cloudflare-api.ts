import { env } from "$env/dynamic/private";

const BASE_URL = 'https://api.cloudflare.com/client/v4';
const getBaseURL = (v: 1 | 2) => `${BASE_URL}/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v${v}`;
const request = async (url: string, options: RequestInit) => {
    console.log(url, options)
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`
        }
    });
    if (!response.ok) {
        throw new Error(`Cloudflare API request failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const cloudflareImages = {
    list: async () => {
        return request(getBaseURL(2), { method: 'GET' }).then((response) => response.result.images as Image[]);
    },
    upload: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', id);
        return request(getBaseURL(1), { method: 'POST', body: formData });
    },
    delete: async (id: string) => {
        return request(`${getBaseURL(1)}/${id}`, { method: 'DELETE' });
    }
}

type Image = {
    id: string;
    filename: string;
    meta: Record<string, unknown>;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
}