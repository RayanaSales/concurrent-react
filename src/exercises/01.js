// Simple Data-fetching

// http://localhost:3000/isolated/exercises/01

import React from 'react'
import fetchPokemon from 'fetch-pokemon'
import {
  PokemonDataView,
  ErrorBoundary,
  createResource,
  PokemonInfoFallback,
} from '../utils'

const pokemonResource = createResource(() => fetchPokemon('Pikachu'))

function PokemonInfo() {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info">
      <ErrorBoundary>
        <React.Suspense fallback={<PokemonInfoFallback name="Pikachu" />}>
          <PokemonInfo />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
