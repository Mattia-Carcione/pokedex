export async function FetchPokemonByUrl(url: string, isSpecies: boolean = false) {
    console.log(`Inizio processo FetchPokemonByUrl: ${url}`);
    const fetchUrl = isSpecies ? url : url.replace("-species", "");
    try {
        const res = await SafeFetchAsync(fetchUrl);
        if (!res.ok) console.log(`FetchPokemonByUrl Failed to fetch pokemon: ${fetchUrl} (status ${res.status})`);
        return await res.json();
    } catch (err) {
        console.log(`FetchPokemonByUrl failed for URL: ${fetchUrl}.\n Error: ${err}`);
    }
}

async function SafeFetchAsync(url: string, retries = 3) {
    console.log(`Inizio processo SafeFetchAsync per: ${url}`);
    let error;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            error = response.status + response.statusText;
        } catch (err) {
            error = err;
        }
        await new Promise(r => setTimeout(r, 500));
    }
    throw new Error(`SafeFetchAsync Failed after ${retries} attempts: ${url}\nError: ${error}`);
}