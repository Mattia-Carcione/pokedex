<?php

namespace App\Http\Controllers;

use App\Models\Generation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

//ottieni la lista delle generazioni

class GenerationController extends Controller
{
    public function fetchAndStoreGenerationData()
    {
        $generationList = Http::get("https://pokeapi.co/api/v2/generation")->json();

        foreach ($generationList['results'] as $generation) {
            Generation::create([
                'generation' => $generation['name'],
            ]);
        }

        return 'Dati archiviati nel database con successo.';
    }
}