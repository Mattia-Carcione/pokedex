import fs from "node:fs";
import path from "path";
import cliProgress from "cli-progress";

const BASE_PATH_API = 'https://pokeapi.co/api/v2';
const BASE_URL = [
    { id: 'generation', label: 'Generation', href: `${BASE_PATH_API}/generation/` },
    { id: 'pokemon', label: 'Pokémon', href: `${BASE_PATH_API}/pokemon/` },
    { id: 'species', label: 'Pokémon species', href: `${BASE_PATH_API}/pokemon-species/` },
];
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
let count = 0;

const generationsDir = path.resolve("src/data/generations.json");
const generationDataDir = path.resolve("src/data/generationData.json");
const stateDir = path.resolve("src/states/state.json");

async function StartAsync() {
    const lastFetch = getSavedDate();
    if (lastFetch && isWithinSixMonths(lastFetch))
        return;

    console.log('Inizio processo StartAsync...');
    try {
        bar.start(0, 0);
        await ReadAndWriteAsync();
        console.log('Fine processo StartAsync senza errori.');
        bar.stop();
        saveDate(new Date().toISOString());
        return;
    } catch (err) {
        throw new Error(`StartAsync failed.\nError: ${err}`);
    }
}

async function ReadAndWriteAsync() {
    console.log('Inizio processo ReadAndWriteAsync...');
    try {
        const fetchApi = await FetchGenerationsAsync();
        console.log('Processo FetchGenerationsAsync terminato senza errori.');
        CreateFileJson(generationsDir, JSON.stringify(fetchApi, null, 2));
        const data = await Promise.all(fetchApi.results.map(async ({ url }, x) => {
            try {
                const response = await SafeFetchAsync(url);
                console.log('SafeFetchAsync terminato senza errori.');
                count += (x++ / fetchApi.results.length) / 3;
                bar.update(count);
                if (!response.ok) throw new Error(`ReadAndWriteAsync Failed to fetch: ${url} (status ${response.status})`);
                return await response.json();
            } catch (err) {
                throw new Error(`ReadAndWriteAsync failed to SafeFetchAsync ${url}.\nError: ${err}`);
            }
        }));
        data.forEach(x => x.pokemon_species = Sort(x.pokemon_species));
        CreateFileJson(generationDataDir, JSON.stringify(data, null, 2));
        console.log('ReadAndWriteAsync terminato con successo.')
    } catch (err) {
        throw new Error(`ReadAndWriteAsync failed.\nError: ${err}`);
    }
}

async function FetchGenerationsAsync() {
    console.log('Inizio processo FetchGenerationsAsync');
    const URL = BASE_URL.find(x => x.id == 'generation')?.href;
    if (!URL) throw new Error('FetchGenerationsAsync failed: the URL is empty.');
    try {
        const response = await SafeFetchAsync(URL);
        if (!response.ok) throw new Error(`FetchGenerationsAsync failed to fetch generations: ${response.status}`);
        return await response.json();
    } catch (err) {
        throw new Error(`FetchGenerationsAsync failed to fetch generations: ${err}`);
    }
}

async function SafeFetchAsync(url, retries = 10) {
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
        await new Promise(r => setTimeout(r, 5000));
    }
    throw new Error(`SafeFetchAsync Failed after ${retries} attempts: ${url}\nError: ${error}`);
}

function CreateFileJson(src, data) {
    console.log(`Inizio processo CreateFileJson in ${src}`)
    try {
        const dir = path.dirname(src);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(src, data);
        console.log('CreateFileJson terminato senza errori.')
    } catch (err) {
        throw new Error(`CreateFileJson failed writing to ${src}. \nError: ${err}`);
    }
}

function Sort(data) {
    console.log('Inizio processo Sort');
    try {
        return data.sort((a, b) => {
            try {
                const idA = Number(a.url.split("/").filter(Boolean).pop());
                const idB = Number(b.url.split("/").filter(Boolean).pop());
                return idA - idB;
            } catch (err) {
                throw new Error(`Sort failed sorting: ${a} and ${b}. \n Error: ${err}`);
            }
        });
    } catch (err) {
        throw new Error(`Sort failed. \n Error: ${err}`);
    }
}

function getSavedDate() {
    try {
        const dir = path.dirname(stateDir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            const dateObj = { lastFetch: new Date().toISOString() };
            fs.writeFileSync(stateDir, JSON.stringify(dateObj));
        }
        const raw = fs.readFileSync(stateDir, "utf8");
        const data = JSON.parse(raw);
        return data.lastFetch ? new Date(data.lastFetch) : null;
    } catch (err) {
        throw err;
    }
}

function saveDate(date) {
    try {
        fs.writeFileSync(stateDir, JSON.stringify({ lastFetch: date }));
    } catch (err) {
        throw err;
    }
}

function isWithinSixMonths(last) {
    try {
        const sixMonthsLater = new Date(last);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        return new Date() < sixMonthsLater;
    } catch (err) {
        throw err;
    }
}

await StartAsync();