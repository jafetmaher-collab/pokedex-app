// Definimos una interfaz ya que solo vamos a definir propiedades

import { IStat } from "./stats.model";

//pokemon.model.ts: al ser un modelo asegura que los datos sean correctos
export interface Ipokemon {
id: number;
name: string;
height: number;
weight: number;
abilities: string[];
sprite: string;
type1: string;
//?: Indica que es opcional y puede no existir
type2?: string;
hiddenAbility?: string;
stats: IStat[];

}

// Tarea optimizar el plugin capacitor http, ya viene instalado por defecto en el proyecto solo hay que instalarlo
// se habilita en el archivo capacitor.config.json
// subir cambios a rama page
