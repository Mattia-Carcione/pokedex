<main class="container mb-5">
    <div class="row justify-content-start">

        {{-- card --}}
        @foreach ($pokemonData as $pokemon)
            <div class="card col-md-3 me-1 mb-1 trans-scale {{ $pokemon->type_1 }}" style="width: 15rem; height: 22rem;">
                <a href="{{ route('show', $pokemon->name) }}" class="nav-link">
                    <div class="d-flex justify-content-between">
                        <p>
                            <span>#</span>
                            {{ $pokemon->pokedex_number }}
                        </p>
                        <p>
                            <span>{{ $pokemon->type_1 }}</span>
                        </p>
                    </div>

                    <div class="text-center">
                        <img src="{{ $pokemon->image_url }}" class="card-img-top" alt="{{ $pokemon->name }}">
                    </div>

                    <div class="text-center text-container">
                        <h2 class="card-title">{{ $pokemon->name }}</h2>
                        <div class="stats fs-6 pt-3">
                            <div>
                                <p>Attack</p>
                                <h5>{{ $pokemon->stats[1]['base_stat'] }}</h5>
                            </div>
                            <div>
                                <p>Defense</p>
                                <h5>{{ $pokemon->stats[2]['base_stat'] }}</h5>
                            </div>
                            <div>
                                <p>Speed</p>
                                <h5>{{ $pokemon->stats[5]['base_stat'] }}</h5>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        @endforeach
        
    </div>
</main>
