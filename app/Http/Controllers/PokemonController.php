<?php

namespace App\Http\Controllers;

use App\Models\Pokemon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PokemonController extends Controller
{
    public function fetchAndStorePokemonData()
    {
        $limit = 1008; //imposta il limite di dati da implementare nel database, max 1008

        $pokemonList = Http::get("https://pokeapi.co/api/v2/pokemon?limit={$limit}&offset=0")->json();

        foreach ($pokemonList['results'] as $pokemon) {
            $pokemonData = Http::get($pokemon['url'])->json();
            $pokedexData = Http::get("https://pokeapi.co/api/v2/pokemon-species/{$pokemonData['id']}")->json();
            $generation = Http::get("{$pokedexData['generation']['url']}")->json();

            Pokemon::create([
                'name' => $pokemonData['name'],
                'pokedex_number' => $pokedexData['pokedex_numbers'][0]['entry_number'],
                'pokedex_description' => $pokedexData['flavor_text_entries'][0]['flavor_text'],
                'stats' => json_encode($pokemonData['stats']),
                'type_1' => $pokemonData['types'][0]['type']['name'],
                'type_2' => $this->setSecondType($pokemonData),
                'image_url' => $pokemonData['sprites']['front_default'],
                'generation_id' => $generation['id']
            ]);
        }
        return 'Dati Pokémon archiviati nel database con successo.';
    }
    public function setSecondType($pokemonData)
    {
        if ($pokemonData['types'][1] ?? null) {
            return $pokemonData['types'][1]['type']['name'];
        } else
            return 'none';
    }
}