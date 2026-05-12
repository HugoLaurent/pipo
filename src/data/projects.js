const grisBVideo = "/media/videos/gris-b.mov";
const pubDiorVideo = "/media/videos/pub-dior.mp4";
const pubIphoneVideo = "/media/videos/pub-iphone-16.mp4";
const pubMercedesVideo = "/media/videos/pub-mercedes-vincent.mp4";
const pubNikeVideo = "/media/videos/pub-nike.mp4";
const pubRollsRoyceVideo = "/media/videos/pub-rolls-royce.mp4";

export const PROJECTS = [
  {
    slug: "gris-jeu-video",
    title: "Gris — Jeu vidéo",
    shortTitle: "Gris - Jeu vidéo",
    videoUrl: grisBVideo,
    previewTime: 39,
    seoTitle: "Gris - rescoring jeu vidéo | Vincent Gelée",
    seoDescription:
      "Rescoring du jeu vidéo Gris par Vincent Gelée : composition atmosphérique, progression émotionnelle et sound design naturel.",
    description: [
      "Approche poétique et atmosphérique.",
      "J’ai principalement utilisé des instruments issus du classique, en cherchant à construire une progression rythmique sombre et émotionnelle.",
      "Ajout d’effets sonores naturels comme l’eau, le vent ou la roche, mêlés à des textures plus synthétiques afin d’accentuer le côté angoissant et mystérieux.",
    ],
  },
  {
    slug: "publicite-mercedes",
    title: "Publicité Mercedes",
    shortTitle: "Publicité Mercedes",
    videoUrl: pubMercedesVideo,
    seoTitle: "Publicité Mercedes - création sonore | Vincent Gelée",
    seoDescription:
      "Création sonore pour publicité Mercedes par Vincent Gelée : modernité, introduction magnétique et esthétique Trap énergique.",
    description: [
      "Ma première création sonore.",
      "J’ai choisi de mettre en avant la modernité de la marque plutôt que son héritage.",
      "Une introduction magnétique et envoûtante évolue progressivement vers une esthétique Trap plus énergique.",
    ],
  },
  {
    slug: "publicite-rolls-royce",
    title: "Publicité Rolls-Royce",
    shortTitle: "Publicité Rolls-Royce",
    videoUrl: pubRollsRoyceVideo,
    previewTime: 2,
    seoTitle: "Publicité Rolls-Royce - musique à l'image | Vincent Gelée",
    seoDescription:
      "Composition musicale pour publicité Rolls-Royce : piano minimaliste, ambiance luxueuse et évolution Hip-Hop / Trap.",
    description: [
      "Pour souligner l’élégance et le luxe de la marque, j’ai commencé de manière minimaliste avec un piano accompagné d’un pad ambient.",
      "L’idée était de préserver l’émotion portée par l’image.",
      "Lorsque le rythme s’accélère, la composition évolue vers des percussions plus marquées, dans une direction Hip-Hop / Trap.",
    ],
  },
  {
    slug: "publicite-iphone-16",
    title: "Publicité iPhone 16",
    shortTitle: "Publicité iPhone 16",
    videoUrl: pubIphoneVideo,
    previewTime: 10.5,
    seoTitle: "Publicité iPhone 16 - Drum and Bass | Vincent Gelée",
    seoDescription:
      "Composition Drum and Bass pour publicité iPhone 16 : rythme, énergie visuelle et impact commercial.",
    description: [
      "Des images en mouvement constant, du rythme et de l’énergie : la Drum and Bass s’est imposée naturellement pour accompagner cette dynamique visuelle.",
      "J’ai néanmoins varié certaines sections musicales afin d’éviter la redondance.",
      "L’objectif était aussi de renforcer l’impact commercial de la publicité.",
    ],
  },
  {
    slug: "publicite-dior",
    title: "Publicité Dior",
    shortTitle: "Publicité Dior",
    videoUrl: pubDiorVideo,
    seoTitle: "Publicité Dior - composition Pop acoustique | Vincent Gelée",
    seoDescription:
      "Rescoring d'une publicité Dior : composition douce, minimaliste et Pop acoustique par Vincent Gelée.",
    description: [
      "S’attaquer à une publicité portée par Rihanna représentait un vrai défi.",
      "J’ai choisi une approche douce et minimaliste, en accompagnant la préparation de l’artiste avant son entrée en lumière.",
      "La composition évolue ensuite vers une ambiance Pop acoustique plus émotionnelle, jusqu’au célèbre “Dior J’adore”.",
    ],
  },
  {
    slug: "publicite-nike",
    title: "Publicité Nike",
    shortTitle: "Publicité Nike",
    videoUrl: pubNikeVideo,
    previewTime: 10,
    seoTitle: "Publicité Nike - composition Drill | Vincent Gelée",
    seoDescription:
      "Composition inspirée de la Drill pour publicité Nike : énergie rapide, percussions nerveuses et tension sonore.",
    description: [
      "Composition inspirée de la Drill : rapide, nerveuse et énergique.",
      "Après une courte respiration lors de l’apparition de Ronaldinho, la production repart avec encore plus d’intensité percussive.",
      "Le tout se termine sur un “tic-tac” stressant avant le penalty final.",
    ],
  },
];

export function getProjectPath(project) {
  return `/projets/${project.slug}/`;
}

export function getProjectBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug);
}
