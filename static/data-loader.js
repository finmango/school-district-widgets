async function loadResource(url) {
    const response = await fetch(url);
    if (response.ok) {
        return response;
    } else {
        throw new Error('Response failed');
    }
}

async function loadCSV(url) {
    const response = await loadResource(url);
    return $.csv.toObjects(await response.text());
}