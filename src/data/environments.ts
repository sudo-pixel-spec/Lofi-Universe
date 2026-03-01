export type EnvironmentId = "tokyo" | "rooftop" | "cabin";

export type Environment = {
  id: EnvironmentId;
  name: string;

  bgDay: string;
  bgNight: string;

  lofiStreamUrl: string;
  ambientDay?: string;
  ambientNight?: string;

  defaultRain: number;
  defaultNight: boolean;
};

export const ENVIRONMENTS: Environment[] = [
  {
    id: "tokyo",
    name: "Rainy Tokyo Apartment",
    bgDay: "/scenes/tokyo-day.jpg",
    bgNight: "/scenes/tokyo-night.jpg",
    lofiStreamUrl: "/audio/lofi.mp3",
    ambientDay: "/audio/rain-soft.mp3",
    ambientNight: "/audio/rain-city-night.mp3",
    defaultRain: 0.75,
    defaultNight: true
  },
  {
    id: "rooftop",
    name: "Neon Rooftop",
    bgDay: "/scenes/rooftop-day.jpg",
    bgNight: "/scenes/rooftop-night.jpg",
    lofiStreamUrl: "/audio/lofi.mp3",
    ambientNight: "/audio/city-hum.mp3",
    defaultRain: 0.25,
    defaultNight: true
  },
  {
    id: "cabin",
    name: "Cozy Mountain Cabin",
    bgDay: "/scenes/cabin-day.jpg",
    bgNight: "/scenes/cabin-night.jpg",
    lofiStreamUrl: "/audio/lofi.mp3",
    ambientDay: "/audio/fireplace.mp3",
    ambientNight: "/audio/wind-soft.mp3",
    defaultRain: 0.1,
    defaultNight: false
  }
];