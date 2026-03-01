export type EnvironmentId = "tokyo" | "rooftop" | "cabin";

export type Overlay = {
  src: string;
  className?: string;
  animation?: "float" | "flicker" | "sway" | "pulse";
  depth?: number;
};

export type Environment = {
  id: EnvironmentId;
  name: string;

  bgDay: string;
  bgNight: string;

  overlays?: Overlay[];

  lofiStreamUrl: string;
  ambientDay?: string;
  ambientNight?: string;

  rainSfxUrl?: string;

  defaultRain: number;
  defaultNight: boolean;
};

export const ENVIRONMENTS: Environment[] = [
  {
    id: "tokyo",
    name: "Rainy Tokyo Apartment",

    bgDay: "/scenes/tokyo-day.png",
    bgNight: "/scenes/tokyo-night.png",

    overlays: [
      {
        src: "/props/window-glow.png",
        animation: "pulse",
        depth: 0.15,
        className: "mix-blend-screen opacity-70"
      },
    ],

    lofiStreamUrl: "/audio/lofi.mp3",
    ambientDay: "/audio/rain-soft.mp3",
    ambientNight: "/audio/rain-city-night.mp3",

    rainSfxUrl: "/audio/rain-loop.mp3",

    defaultRain: 0.75,
    defaultNight: true
  },

  {
    id: "rooftop",
    name: "Neon Rooftop",

    bgDay: "/scenes/rooftop-day.png",
    bgNight: "/scenes/rooftop-night.png",

    overlays: [
      {
        src: "/props/neon-sign.png",
        animation: "flicker",
        depth: 0.2,
        className: "mix-blend-screen opacity-80"
      },
    ],

    lofiStreamUrl: "/audio/lofi.mp3",
    ambientNight: "/audio/city-hum.mp3",

    rainSfxUrl: "/audio/rain-loop.mp3",

    defaultRain: 0.25,
    defaultNight: true
  },

  {
    id: "cabin",
    name: "Cozy Mountain Cabin",

    bgDay: "/scenes/cabin-day.jpg",
    bgNight: "/scenes/cabin-night.png",

    overlays: [
      {
        src: "/props/fireplace-glow.png",
        animation: "pulse",
        depth: 0.12,
        className: "mix-blend-screen opacity-75"
      },
    ],

    lofiStreamUrl: "/audio/lofi.mp3",
    rainSfxUrl: "/audio/rain-loop.mp3",

    defaultRain: 0.1,
    defaultNight: false
  }
];