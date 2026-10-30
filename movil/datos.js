// Datos resumidos de la página web (index.html). Actualizado: 29 de octubre de 2026.
export const ACTUALIZADO = '29 de octubre de 2026';
export const ELECCION = new Date(2027, 5, 6);

export const COLORES_PARTIDO = {
  Morena: '#8a1c32',
  PAN: '#1f4f9c',
  PRI: '#1d7a46',
  MC: '#e26a12',
  'Movimiento Ciudadano': '#e26a12',
  PT: '#c4302b',
  PVEM: '#3f8f2f',
};
export const colorPartido = (p) => COLORES_PARTIDO[p] || '#6b6f7a';

// grave > denuncia > crítica > hecho
export const ETIQUETAS = {
  grave: { texto: 'GRAVE', fondo: '#a3361f', letra: '#ffffff', ayuda: 'Hubo muertes o daño serio' },
  denuncia: { texto: 'DENUNCIA', fondo: '#f8e4dc', letra: '#a3361f', ayuda: 'Lo acusaron ante una autoridad' },
  critica: { texto: 'CRÍTICA', fondo: '#f7eccd', letra: '#7a5400', ayuda: 'Señalamiento político o de medios' },
  hecho: { texto: 'DATO', fondo: '#eceee9', letra: '#1c2321', ayuda: 'Algo que conviene saber' },
};

export const RESUMEN = [
  'El 6 de junio de 2027 eliges gobernador, alcalde y diputados.',
  'Hoy nadie es candidato oficial: son aspirantes.',
  'Morena ya eligió a Lorenia Valles. Va arriba en las encuestas.',
  'En la oposición suenan Astiazarán (PAN), Colosio (MC) y Gándara (PRI).',
];

export const ENCUESTA = {
  texto: 'Lorenia Valles va adelante por 8 a 11 puntos. Depende de si el PAN y el PRI se juntan (aún no lo deciden).',
  fuente: 'CE Research, 19 oct 2026',
  url: 'https://ceonline.com.mx/sonora-encuesta-estatal-2026-10/',
};

export const ASPIRANTES = [
  {
    id: 'valles',
    nombre: 'Lorenia Valles',
    partido: 'Morena',
    hoy: 'Coordinadora de Morena en Sonora',
    enUnaFrase: 'Lleva casi 30 años en política y dos veces dejó un cargo a medias.',
    puntos: [
      {
        tipo: 'hecho',
        titulo: 'Dejó a medias dos cargos',
        detalle: 'En 2021 renunció a su diputación al empezar. En 2026 pidió licencia como senadora para buscar la gubernatura.',
        quedo: 'Es legal.',
        url: 'https://en.wikipedia.org/wiki/Lorenia_Valles_Sampedro',
      },
      {
        tipo: 'critica',
        titulo: 'La acusan de “imposición”',
        detalle: 'Militantes de Morena dicen que la impuso el gobernador Durazo.',
        quedo: 'Morena dice que ganó una encuesta, pero no publicó las cifras.',
        url: 'https://www.infobae.com/mexico/2026/09/29/quien-es-lorenia-valles-la-elegida-de-morena-en-sonora-a-quien-gritaron-va-a-perder-en-plena-presentacion/',
      },
    ],
    presume: 'Presidió la Comisión de Minería del Senado.',
  },
  {
    id: 'astiazaran',
    nombre: 'Antonio Astiazarán',
    partido: 'PAN',
    hoy: 'Alcalde de Hermosillo',
    enUnaFrase: 'Gobernó Guaymas y Hermosillo. Tiene una denuncia de 2021 sin resolver.',
    puntos: [
      {
        tipo: 'denuncia',
        titulo: 'Denuncia por hasta $80 millones en Guaymas',
        detalle: 'Exfuncionarios lo denunciaron ante la FGR por la concesión de la basura cuando fue alcalde (2006–2009).',
        quedo: 'Él lo niega. No hay resolución pública.',
        url: 'https://oem.com.mx/elsoldehermosillo/local/tono-astiazaran-denunciado-por-irregularidades-de-hasta-80-mdp-danos-patrimoniales-fgr-uif-19234079',
      },
      {
        tipo: 'critica',
        titulo: 'Quiso subir cobros en 2025',
        detalle: 'Morena dijo que su Ley de Ingresos subía agua y multas. El Congreso la rechazó.',
        quedo: 'Él dice que frenaron obras de agua.',
        url: 'https://www.razon.com.mx/estados/2024/12/16/denuncian-intento-de-aumento-en-servicios-y-multas-en-hermosillo/',
      },
      {
        tipo: 'critica',
        titulo: 'Habló de empresas privadas en el agua',
        detalle: 'En 2024 propuso que empresas participen en el servicio de agua.',
        quedo: 'No hay nada aprobado.',
        url: 'https://www.sdpnoticias.com/estados/sonora/antonio-astiazaran-amaga-con-privatizar-servicio-del-agua-en-hermosillo-sonora/',
      },
      {
        tipo: 'hecho',
        titulo: 'Dejaría la alcaldía a medias',
        detalle: 'Lo reeligieron hasta 2027. Para ser candidato tendría que irse antes.',
        quedo: 'Es legal.',
        url: 'https://proyectopuente.com.mx/2026/10/12/tono-astiazaran-ya-tiro-a-hermosillo-para-el-es-mas-importante-darle-un-reconocimiento-a-yahir-dice-celida-lopez',
      },
    ],
    presume: 'Primer alcalde reelecto de Hermosillo (45% en 2024).',
  },
  {
    id: 'colosio',
    nombre: 'Luis Donaldo Colosio',
    partido: 'MC',
    hoy: 'Senador por Nuevo León',
    enUnaFrase: 'Nació en Sonora, pero su carrera es en Nuevo León. No ha dicho por cuál estado va.',
    puntos: [
      {
        tipo: 'critica',
        titulo: 'Botes de basura de $21,000',
        detalle: 'Como alcalde de Monterrey compró botes caros; en 2024 aparecieron unos 60 abandonados.',
        quedo: 'Dijo que fue por vandalismo.',
        url: 'https://www.publimetro.com.mx/nuevo-leon/2024/03/25/colosio-riojas-llama-hijos-de-la-chin-a-quienes-vandalizaron-botes-de-basura-en-monterrey/',
      },
      {
        tipo: 'hecho',
        titulo: 'No ha decidido: ¿Sonora o Nuevo León?',
        detalle: 'Dice que ya decidió, pero lo anunciará hasta que lo permita la ley.',
        quedo: 'Si compite, dejaría el Senado a medias.',
        url: 'https://www.elimparcial.com/mexico/2026/08/25/luis-donaldo-colosio-ya-decidio-su-futuro-politico-rumbo-a-2027-pero-esperara-los-plazos-legales-para-revelar-si-competira-por-sonora-o-nuevo-leon/',
      },
    ],
    presume: 'Fue alcalde de Monterrey (2021–2024).',
  },
  {
    id: 'gandara',
    nombre: 'Ernesto Gándara',
    partido: 'PRI',
    hoy: 'Exsenador',
    enUnaFrase: 'Era alcalde de Hermosillo cuando se incendió la Guardería ABC. Perdió la gubernatura en 2021.',
    puntos: [
      {
        tipo: 'grave',
        titulo: 'Guardería ABC (2009)',
        detalle: 'Murieron 49 niños. Él era el alcalde y su gobierno estaba a cargo de Protección Civil.',
        quedo: 'Nunca fue juzgado. Los padres siguen pidiendo justicia.',
        url: 'https://es.wikipedia.org/wiki/Incendio_de_la_Guarder%C3%ADa_ABC',
      },
      {
        tipo: 'hecho',
        titulo: 'Ya perdió en 2021',
        detalle: 'Sacó 35.6% contra 51.5% de Alfonso Durazo.',
        quedo: 'Reconoció su derrota.',
        url: 'https://www.razon.com.mx/estados/priista-ernesto-gandara-reconoce-derrota-alfonso-durazo-le-desea-suerte-437950',
      },
    ],
    presume: 'Fue senador por Sonora (2012–2018).',
  },
];

// Aspirantes a alcaldía 2027 conocidos (solo donde hay nombres públicos)
export const ALCALDIA_2027 = {
  Hermosillo: 'Morena eligió sin encuesta a Célida López (exalcaldesa, antes del PAN).',
  Cajeme: 'Once personas se registraron con Morena. Aún no eligen.',
  Nogales: '18 personas se registraron con Morena. La lista sale antes del 31 de diciembre.',
};

export const PREGUNTAS = [
  '¿Qué se le critica y cómo respondió?',
  '¿Terminó sus cargos anteriores?',
  '¿Ha cambiado de partido? ¿Por qué?',
  '¿Qué hizo de verdad en su último cargo?',
  '¿Conoce los problemas de tu colonia?',
  '¿Qué propone y con qué dinero?',
];
