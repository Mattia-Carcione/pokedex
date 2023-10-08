<nav>
    <div class="text-center pt-4 position-md-absolute">
        <a href="{{ route('index') }}"><img src="\pokemon-23.svg" class="poke-logo" alt=""></a>
    </div>

    <div class="my-5">
        <h1 class="pokedex-logo pb-3">
            P<i class="pokeball"></i>kédex
        </h1>

        <div class="d-flex justify-content-center">
            <span class="pb-1" id="set-gen">
                select gen:
            </span>
        </div>
        <div class="gen-nav mt-4">
            @foreach ($generations as $generation => $number)
                <a class="navigation-link @if ($uri == "generation-$number") active @endif"
                    href="{{ route('index', ['uri' => "generation-$number"]) }}">{{ $generation }}</a>
            @endforeach
        </div>
    </div>
</nav>

{{-- navbar che appare on scroll down --}}
<div class="nav-bl hidden z-1" id="nav">
    <i class="fa-solid fa-chevron-up" id="arrow-up"></i>
    <i class="fa-solid fa-chevron-down hidden" id="arrow-down"></i>
    <a class="navigation-link" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" id="nav-btn">
        <i class="pokeball" style="font-size: 45px"></i>
    </a>

    <div class="collapse gen-nav" id="navbarSupportedContent">
        @foreach ($generations as $generation => $number)
            <a class="navigation-link @if ($uri == "generation-$number") active @endif"
                href="{{ route('index', ['uri' => "generation-$number"]) }}">{{ $generation }}</a>
        @endforeach
    </div>
</div>
