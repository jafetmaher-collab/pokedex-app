import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Ipokemon } from '../models/pokemon.model';
@Injectable({
  providedIn: 'root'
})
export class Pokemon {
  //URL base den endpoint de la api
  private readonly URL_BASE = 'https://pokeapi.co/api/v2/pokemon/';
  private nextURL = `${this.URL_BASE}?limit=20&offset=0`;
  getPokemons() {
    if (this.nextURL) {
      const options = {
        url: this.nextURL,
        params: {}
      };
      

      return CapacitorHttp.get(options).then(async (response: HttpResponse) => {
        console.log("Response:", response);
        const pokemons: Ipokemon[] = [];

        if (response.data) {
          const results = response.data.results; 
          this.nextURL = response.data.next; 

          // peticion 2 solicitar por cada registro

          const promises: Promise<HttpResponse> [] = []; 
          for (const result of results) {
            const urlPokemon = result.url; 
            const optionsPokemon = {
              url: urlPokemon,
              params: {},
            };
            promises.push(CapacitorHttp.get(optionsPokemon));
          }
          await Promise.all(promises).then((responses: HttpResponse[]) => {
            console.log(responses);
            for (const response of responses){
              const pokemon = this.procesPokemon(response.data); 
              pokemons.push(pokemon); 
            }
          });
        }
        return pokemons;
      });
    }

    return null;
  }

  getPokemon(id: number) {
  const options = {
    url: `${this.URL_BASE.replace(/\/$/, '')}/${id}`,
    params: {}
  };

  return CapacitorHttp.get(options).then(
    (response: HttpResponse) => {
      return this.procesPokemon(response.data);
    }
  );
}

private procesPokemon(pokemonData: any): Ipokemon {
  const pokemon: Ipokemon = {
      id: pokemonData.id, 
      name: pokemonData.name, 
      type1: pokemonData.types[0].type.name,
      type2: pokemonData.types[1]?.type.name,
      sprite: pokemonData.sprites.front_default, 
      weight: pokemonData.weight / 10,
      height: pokemonData.height / 10,
    abilities: pokemonData.abilities
  .filter((ability: any) => !ability.is_hidden)
  .map((ability: any) => ability.ability.name),
  
      stats: pokemonData.stats.map((stat: any) => {
  return {
    base_stat: stat.base_stat,
    name: stat.stat.name
  };
})
};


    // Buscar habilidad oculta
    const habilidadOculta = pokemonData.abilities.find(
      (ability: any) => ability.is_hidden === true
    );

    // Asignar habilidad oculta al Pokémon
    pokemon.hiddenAbility = habilidadOculta
      ? habilidadOculta.ability.name
      : undefined;

    return pokemon;
  }
}

