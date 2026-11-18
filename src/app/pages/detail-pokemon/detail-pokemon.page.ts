import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetStatPipe } from '../../../pipes/get-stat-pipe';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonSpinner,
  IonBadge,
  IonFab,
  IonFabButton,
  IonProgressBar
} from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../../services/pokemon';
import { Ipokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
 imports: [
  CommonModule,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonSpinner,
  IonBadge,
  IonFab,
  IonFabButton,
  IonProgressBar,
  GetStatPipe
]
})
export class DetailPokemonPage {

  private route = inject(ActivatedRoute);
  private pokemonService = inject(Pokemon);
  private router = inject(Router);

  pokemon = signal<Ipokemon | null>(null);
  cargando = signal(true);
  error = signal('');

  estadisticas = [
  { nombre: 'PS', clave: 'hp' },
  { nombre: 'ATAQUE', clave: 'attack' },
  { nombre: 'DEFENSA', clave: 'defense' },
  { nombre: 'AT. ESP.', clave: 'special-attack' },
  { nombre: 'DEF. ESP.', clave: 'special-defense' },
  { nombre: 'VELOCIDAD', clave: 'speed' }
];

  async ionViewWillEnter() {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('ID de Pokémon inválido');
      this.cargando.set(false);
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.pokemon.set(null);

    try {
      const resultado = await this.pokemonService.getPokemon(id);
      this.pokemon.set(resultado);
    } catch (error) {
      console.error('Error al obtener Pokémon:', error);
      this.error.set('No se pudo cargar el Pokémon');
    } finally {
      this.cargando.set(false);
    }
  }

  // Regresar al listado de Pokémon
volver() {
  this.router.navigate(['/list-pokemon']);
}

// Mostrar nombres de estadísticas en español
nombreStat(nombre: string): string {
  const nombres: Record<string, string> = {
    'hp': 'PS',
    'attack': 'ATAQUE',
    'defense': 'DEFENSA',
    'special-attack': 'AT. ESP.',
    'special-defense': 'DEF. ESP.',
    'speed': 'VELOCIDAD'
  };

  return nombres[nombre] || nombre;
}
}

