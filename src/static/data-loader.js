async function loadResource(url) {
    const response = await fetch(url);
    if (response.ok) {
        return response;
    } else {
        throw new Error('Response failed');
    }
}

async function loadCSV(url, forceCors = false) {
    if (forceCors) url = `https://cors-anywhere.herokuapp.com/${url}`;
    const response = await loadResource(url);
    return $.csv.toObjects(await response.text());
}

function recordsToDataTable(records, columns = null) {
    columns = columns || Object.keys(records[0]);
    const data = [columns].concat(records.map(row => columns.map(col => row[col])));
    return google.visualization.arrayToDataTable(data);
}