
import { Component, inject, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
  IonBadge,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  LoadingController
} from '@ionic/angular';

import { Router } from '@angular/router';
import { Pokemon } from '../../services/pokemon';
import { Ipokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-list-pokemon',
  templateUrl: './list-pokemon.page.html',
  styleUrls: ['./list-pokemon.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ]
})
export class ListPokemonPage {

  private pokemonService = inject(Pokemon);
  private loadingController = inject(LoadingController);
  private router = inject(Router);

  pokemons = signal<Ipokemon[]>([]);
  error = signal('');

  ionViewWillEnter() {
    if (this.pokemons().length === 0) {
      this.morePokemon();
    }
  }

  async morePokemon(event?: InfiniteScrollCustomEvent) {

    const promisePokemons = this.pokemonService.getPokemons();

    if (!promisePokemons) {
      if (event) {
        event.target.disabled = true;
        await event.target.complete();
      }
      return;
    }

    let loading;

    try {
      if (!event) {
        loading = await this.loadingController.create({
          message: 'Cargando Pokémon...'
        });

        await loading.present();
      }

      const nuevos = await promisePokemons;

      this.pokemons.update(actuales =>
        actuales.concat(nuevos)
      );

    } catch (error) {
      console.error('Error al obtener Pokémon:', error);
      this.error.set('No se pudieron cargar los Pokémon');

    } finally {
      await loading?.dismiss();
      await event?.target.complete();
    }
  }

  goToDetail(pokemon: Ipokemon) {
    this.router.navigate(['/detail-pokemon', pokemon.id]);
  }
}

