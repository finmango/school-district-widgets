async function loadResource(url) {
    const response = await fetch(url);
    if (response.ok) {
        return response;
    } else {
        throw new Error('Response failed');
    }
}

function loadCSV(url, forceCors = false) {
    // Early exit: return from cache
    if (url in CACHE['CSV']) return CACHE['CSV'][url];
    // Add promise to cache to avoid others loading simultaneously
    CACHE['CSV'][url] = new Promise(async (resolve, reject) => {
        if (forceCors) url = `https://cors-anywhere.herokuapp.com/${url}`;
        const response = await loadResource(url);
        const csvText = await response.text();
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: result => {
                if (result.errors.length > 0) {
                    reject(result.errors[0]);
                } else {
                    resolve(result.data);
                }
            }
        });
    });
    return CACHE['CSV'][url];
}

function recordsToDataTable(records, columns = null) {
    columns = columns || Object.keys(records[0]);
    const data = [columns].concat(records.map(row => columns.map(col => row[col])));
    return google.visualization.arrayToDataTable(data);
}

function loadGoogleCharts(packages = ['corechart']) {
    // Early exit: return from cache
    const cacheKey = packages.join(',');
    if (cacheKey in CACHE['gcharts']) return CACHE['gcharts'][cacheKey];
    // Add promise to cache to avoid others loading simultaneously
    CACHE['gcharts'][cacheKey] = google.charts.load('current', { packages: packages });
    return CACHE['gcharts'][cacheKey];
}

function getWindowDistrictId(window_) {
    return new URLSearchParams(window_.location.search).get('district_id');
}

async function findStateLocationKey(districtId) {
    const metadata = await loadCSV(`${CURRENT_OPTIONS['tcm-metadata-url']}`);
    const districtMetadata = metadata.filter(row => row.district_id === districtId)[0];
    return `US_${districtMetadata.state}`;
}

async function findCountyLocationKey(districtId) {
    const metadata = await loadCSV(`${CURRENT_OPTIONS['tcm-metadata-url']}`);
    const districtMetadata = metadata.filter(row => row.district_id === districtId)[0];

    // Some district IDs are actually FIPS
    const zipIndex = await loadCSV(`${CURRENT_OPTIONS['zip-data-url']}`);
    if (zipIndex.filter(row => row.fips === districtId).length > 0) {
        return `US_${districtMetadata.state}_${districtId}`;
    } else {
        const fips = zipIndex.filter(row => row.zip === districtMetadata.zip_code)[0].fips;
        return `US_${districtMetadata.state}_${fips}`;
    }
}
