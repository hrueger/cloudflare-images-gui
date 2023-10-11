<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
    let showUploadModal = false;
</script>

<details class="container mt-4" open>
    <summary>Images</summary>
    {#await data.streamed.images}
        <div class="d-flex justify-content-center mt-5 pt-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    {:then images}
        <div class="d-flex justify-content-between">
            <h1>{images.length} images</h1>
            <div>
                <button on:click={() => showUploadModal = true} class="btn btn-primary">Upload</button>
            </div>
        </div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Filename</th>
                    <th>Preview</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each  images as image}
                    <tr>
                        <td>{image.id}</td>
                        <td>{image.filename}</td>
                        <td><img src={image.variants[1]} alt={image.filename} class="img-fluid" /></td>
                        <td>
                            <form action="?/delete" method="POST">
                                <input type="hidden" name="id" value={image.id}>
                                <button type="submit" class="btn btn-outline-danger">Delete</button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:catch error}
        <pre>{JSON.stringify(error, null, 2)}</pre>
    {/await}
</details>

<details class="container mt-4">
    <summary>Settings</summary>
    {#await data.streamed.accountConfig}
        Loading...
    {:then accountConfig}
        Current TTL: {accountConfig.browser_ttl} seconds ({Math.round(accountConfig.browser_ttl / 60 / 60 / 24)} days)
    {:catch error}
        <pre>{JSON.stringify(error, null, 2)}</pre>
    {/await}
    <form method="POST" action="?/setAccountTTL">
        <select name="ttl" class="form-select">
            <option value="31536000">1 year</option>
            <option value="15768000">6 months</option>
            <option value="7884000">3 months</option>
            <option value="2592000">1 month</option>
            <option value="604800">1 week</option>
            <option value="172800">2 days</option>
            <option value="86400">1 day</option>
        </select>
        <button type="submit" class="btn btn-primary">Set account TTL</button>
    </form>
</details>

<div class="modal fade" class:show={showUploadModal} class:d-block={showUploadModal} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Upload image</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={() => showUploadModal = false}></button>
            </div>
            <div class="modal-body">
                <form action="?/upload" method="POST" id="upload" enctype="multipart/form-data">
                    <input type="file" class="form-control" name="file">
                    <input type="text" class="form-control" placeholder="ID" name="id" value="logos/dein-ticket.shop/abc">
                    <input type="text" class="form-control" placeholder="Filename" name="filename">
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" on:click={() => showUploadModal = false}>Close</button>
                <button type="submit" class="btn btn-primary" form="upload">Upload</button>
            </div>
        </div>
    </div>
</div>