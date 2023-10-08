<?php

namespace App\Http\Controllers;

use App\Models\Generation;
use App\Models\Pokemon;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    protected static $generations = [
        'I' => 1,
        'II' => 2,
        'III' => 3,
        'IV' => 4,
        'V' => 5,
        'VI' => 6,
        'VII' => 7,
        'VIII' => 8,
        'IX' => 9,
    ];
    protected static $colorType = [
        'normal' => '#A8A77A',
        'fire' => '#EE8130',
        'water' => '#6390F0',
        'electric' => '#F7D02C',
        'grass' => '#7AC74C',
        'ice' => '#96D9D6',
        'fighting' => '#C22E28',
        'poison' => '#A33EA1',
        'ground' => '#E2BF65',
        'flying' => '#A98FF3',
        'psychic' => '#F95587',
        'bug' => '#A6B91A',
        'rock' => '#B6A136',
        'ghost' => '#735797',
        'dragon' => '#6F35FC',
        'dark' => '#705746',
        'steel' => '#B7B7CE',
        'fairy' => '#D685AD',
    ];

    //index's methods
    public function index($uri = 'generation-1')
    {
        $pokemonData = $this->getGeneration($uri);
        return view('index', ['uri' => $uri, 'generations' => self::$generations, 'pokemonData' => $pokemonData,]);
    }
    public function getGeneration($uri)
    {
        $pokemonGeneration = Generation::where('id', preg_replace("/[^0-9]/", "", $uri))->firstOrFail();
        $pokemonData = $pokemonGeneration->pokemon;
        return $pokemonData;
    }

    //show's methods
    public function show($pokemonName)
    {
        $pokemonData = Pokemon::all()->where('name', $pokemonName)->first();
        return $this->getColorAndPokemon($pokemonData);
    }
    public function getColorAndPokemon($pokemonData)
    {
        if ($pokemonData) {
            $color = self::$colorType[$pokemonData->type_1];
            return view('show', compact('pokemonData', 'color'));
        } else
            abort(404);
    }
}