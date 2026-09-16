export const BIRTHDAY = new Date(2026, 8, 16) // 16 sep 2026

export const letters = [
  {
    id: 'birthday',
    title: 'Feliz cumpleaños',
    body: `May, mi cielo:

Feliz cumpleaños. Felices 23, Marjorie. Ojalá este día te abrace con la misma suavidad con la que tú ablandas mis días.

Te deseo un precioso día, mi niña: que te celebren y canten tu happy birthday, y que te lleven del pastel que tanto te gusta.

Esta página, estas cartas y todo lo que vas a ver lo hice especialmente para ti, son un pedacito de lo que siento, acomodado para ti. Quise que tuvieras algo tuyo, algo que pudieras abrir cuando quisieras.

Que este 16 de septiembre te trate con ternura. Te mereces flores, calma, risas y la certeza de que eres profundamente querida mi niña hermosa.

Con todo mi cariño. =}`,
  },
  {
    id: 'choose',
    title: 'Por qué te elijo',
    body: `Corazón:

Si alguna vez te preguntas por qué te elijo, la respuesta no cabe en una sola frase, pero quiero intentarlo aquí.

Te elijo porque me haces sentir en casa sin pedirme que sea alguien más. Te elijo por tu forma de cuidar, por lo fácil que se vuelve el día cuando estás, por esa mezcla tuya de fuerza y dulzura. Me gusta cómo miras el mundo, cómo amas lo que amas, y cómo, sin darte cuenta, dejas luz en lo ordinario.

Linda, no te elijo solo en los días bonitos. También en los callados, en los cansados, en los que no salen perfectos. Te elijo porque quiero aprender a quererte mejor, con paciencia y verdad. Porque cuando digo “May” o “cielo”, no es costumbre: es reconocimiento. Eres alguien a quien admiro, deseo cuidar y con quien quiero seguir construyendo momentos simples que se sienten grandes.

Mi lindura gracias por existir en mi vida con tu tan única y hermosa forma de ser tan tuya. Elegirte no es un impulso, es una decisión que tomo todos los días con tanta alegría y gusto.

Con amor, Rigo`,
  },
  {
    id: 'future',
    title: 'Para nuestro futuro',
    body: `Mi niña hermosa:

No sé como seran tus dias siempre pero sí sé que estare contigo a tu lado, apoyandote cada vez que lo necesites, o aunque no lo hagas, yo te apoyare, quiero seguir creando memorias contigo, no dudes en que protegere cada uno de tus sentimientos sin importar que.

Quiero crear más memorias contigo, reirnos de las tonterias o bromas que nos hagamos, escribirte más cartas, hacerte detalles, darte flores, seguir conociendote, amarte cada día, besarte, sostenerte, abrazarte hasta quedar con el aroma a tú splash, que sepas que cuentas conmigo en todo lo que hagas y decidas.

Quiero escucharte hablar siempre, de lo que quieras, escucharte reir y ver esa hermosa sonrisa tuya cada vez que pueda, hacerte feliz, hacerte sentir tranquila, que todo estara bien, sin estres, sin problemas, solo tú y yo, abrazaditos o hablando de cualquier cosa.

Con aprecio, your boy`,
  },
] as const

export const paintings = [
  {
    id: 'hands',
    title: 'Juntos',
    caption: 'Una pintura que hicimos con las manos entrelazadas.',
    src: '/images/painting-hands.png',
  },
  {
    id: 'cat-moon',
    title: 'Gato y luna',
    caption: 'Hecha a mano, con paciencia y cariño.',
    src: '/images/painting-cat-moon.png',
  },
  {
    id: 'beach',
    title: 'Orilla',
    caption: 'Un pedacito de calma, pintado para ti.',
    src: '/images/envelope-beach.png',
  },
] as const

export type GiftKind = 'letter' | 'paintings'

export type CharacterGift = {
  id: string
  name: string
  src: string
  giftLabel: string
  kind: GiftKind
  letterId?: (typeof letters)[number]['id']
}

/** Clickable characters that "deliver" gifts */
export const characters: CharacterGift[] = [
  {
    id: 'cinnamoroll',
    name: 'Cinnamoroll',
    src: '/images/characters/cinnamoroll-party.png',
    giftLabel: 'Por qué te elijo',
    kind: 'letter',
    letterId: 'choose',
  },
  {
    id: 'hellokitty',
    name: 'Hello Kitty',
    src: '/images/characters/hellokitty-party.png',
    giftLabel: 'Carta de cumpleaños',
    kind: 'letter',
    letterId: 'birthday',
  },
  {
    id: 'chococat',
    name: 'Chococat',
    src: '/images/characters/chococat-party.png',
    giftLabel: 'Para nuestro futuro',
    kind: 'letter',
    letterId: 'future',
  },
]

export const songs = [
  { id: 'loco', title: 'Loco (tu forma de ser)', file: '/music/loco.mp3' },
  { id: 'far', title: 'Far', file: '/music/far.mp3' },
  { id: 'falling', title: 'Falling in Love', file: '/music/falling-in-love.mp3' },
  { id: 'k', title: 'K.', file: '/music/k.mp3' },
  { id: 'fade', title: 'Fade Into You', file: '/music/fade-into-you.mp3' },
  { id: 'nothing', title: "Nothing's Gonna Hurt You Baby", file: '/music/nothing-s-gonna-hurt-you-baby.mp3' },
  { id: 'japan', title: 'Made in Japan', file: '/music/made-in-japan.mp3' },
  { id: 'apocalypse', title: 'Apocalypse', file: '/music/apocalypse.mp3' },
] as const
