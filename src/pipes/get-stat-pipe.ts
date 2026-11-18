import { Pipe, PipeTransform } from '@angular/core';
import { Ipokemon } from '../app/models/pokemon.model';
import { IStat } from '../app/models/stats.model';

@Pipe({
  name: 'getStat',
  standalone: true
})
export class GetStatPipe implements PipeTransform {

  transform(pokemon: Ipokemon, nameStat: string): number {
    const statFound = pokemon.stats.find((stat: IStat) => {
      return stat.name === nameStat;
    });

    if (statFound) {
      return statFound.base_stat;
    }

    return 0;
  }
}
