import { cloudflareImages } from "$lib/server/cloudflare-api";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    return {
        streamed: {
            images: cloudflareImages.list(),
        }
    }
}

export const actions: Actions = {
    upload: async ({ request }) => {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const id = formData.get('id') as string;
        const filename = formData.get('filename') as string;
        const newFile = new File([file], filename, { type: file.type });
        await cloudflareImages.upload(id, newFile);
    },
    delete: async ({ request }) => {
        const id = await request.formData().then((formData) => formData.get('id') as string);
        await cloudflareImages.delete(id);
    },
}