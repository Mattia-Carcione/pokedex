<?php

use App\Http\Controllers\GenerationController;
use App\Http\Controllers\PokemonController;
use App\Http\Controllers\RouteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

//rotte principali
Route::get('/{uri?}', [RouteController::class, 'index'])->name('index');
Route::get('/pokemon/{pokemon}', [RouteController::class, 'show'])->name('show');

//rotte per inserire i dati dei pokemon nel database
Route::get('/fetch/pokemon', [PokemonController::class, 'fetchAndStorePokemonData']);
Route::get('/fetch/generation', [GenerationController::class, 'fetchAndStoreGenerationData']);