import React from 'react'
import fetchPokemon, {getImageUrlForPokemon} from '../fetch-pokemon'
import {
  ErrorBoundary,
  createResource,
  preloadImage,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '../utils'

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.data.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemonResource.image.read()} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300, // this time is slightly shorter than our css transition delay
  busyMinDurationMs: 700,
}

const pokemonResourceCache = {}

function getPokemonResource(name) {
  const lowerName = name.toLowerCase()
  let resource = pokemonResourceCache[lowerName]
  if (!resource) {
    resource = createPokemonResource(lowerName)
    pokemonResourceCache[lowerName] = resource
  }
  return resource
}

function createPokemonResource(pokemonName) {
  const lowerName = pokemonName
  const data = createResource(() => fetchPokemon(lowerName))
  const image = createResource(() =>
    preloadImage(getImageUrlForPokemon(lowerName)),
  )
  return {data, image}
}

function usePokemonResource(pokemonName) {
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  React.useLayoutEffect(() => {
    if (!pokemonName) {
      return
    }
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonName])

  return [pokemonResource, isPending]
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [pokemonResource, isPending] = usePokemonResource(pokemonName)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div>
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <ErrorBoundary>
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </ErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
