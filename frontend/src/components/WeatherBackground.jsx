import { useEffect, useRef } from 'react';

// How many particles each weather type needs
const CONFIGS = {
  clear:        { count: 1,  type: 'sun' },
  partlyCloudy: { count: 3,  type: 'cloud' },  // fewer clouds + sun visible
  rain:         { count: 80, type: 'raindrop' },
  drizzle:      { count: 40, type: 'raindrop' },
  cloud:        { count: 6,  type: 'cloud' },
  thunder:      { count: 60, type: 'raindrop' },
  snow:         { count: 60, type: 'snowflake' },
  mist:         { count: 5,  type: 'fog' },
  fog:          { count: 5,  type: 'fog' },
  wind:         { count: 12, type: 'windline' },
};

function getConfig(weatherId) {
  if (!weatherId) return null;

  if (weatherId === 800)                              return CONFIGS.clear;
  if (weatherId >= 801 && weatherId <= 802)           return CONFIGS.partlyCloudy;
  if (weatherId >= 803 && weatherId <= 804)           return CONFIGS.cloud;
  if (weatherId >= 200 && weatherId <= 232)           return CONFIGS.thunder;
  if (weatherId >= 300 && weatherId <= 321)           return CONFIGS.drizzle;
  if (weatherId >= 500 && weatherId <= 531)           return CONFIGS.rain;
  if (weatherId >= 600 && weatherId <= 622)           return CONFIGS.snow;
  if (weatherId >= 700 && weatherId <= 799)           return CONFIGS.mist;

  return CONFIGS.cloud; // fallback
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function WeatherBackground({ weatherId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!weatherId || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const config = getConfig(weatherId);
    if (!config) return;

    if (config.type === 'sun') {
      createSun(container);
      return;
    }

    for (let i = 0; i < config.count; i++) {
      let el;
      if (config.type === 'raindrop')  el = createRaindrop();
      if (config.type === 'snowflake') el = createSnowflake();
      if (config.type === 'cloud')     el = createCloud(i);
      if (config.type === 'fog')       el = createFog(i);
      if (config.type === 'windline')  el = createWindLine();
      if (el) container.appendChild(el);
    }

    // Add lightning only for thunderstorm
    if (weatherId >= 200 && weatherId <= 232) {
      createLightning(container);
    }

  }, [weatherId]);

  return (
    <div className="weather-bg-wrapper">
      <div ref={containerRef} className="weather-particles" />
    </div>
  );
}

// ── Sun ──
function createSun(container) {
  const sun = document.createElement('div');
  sun.className = 'particle sun';
  container.appendChild(sun);

  // Sun rays
  for (let i = 0; i < 12; i++) {
    const ray = document.createElement('div');
    ray.className = 'sun-ray';
    ray.style.transform = `rotate(${i * 30}deg)`;
    sun.appendChild(ray);
  }
}

// ── Raindrop ──
function createRaindrop() {
  const drop = document.createElement('div');
  drop.className = 'particle raindrop';
  drop.style.left              = `${random(0, 100)}%`;
  drop.style.animationDuration = `${random(0.6, 1.2)}s`;
  drop.style.animationDelay   = `${random(0, 2)}s`;
  drop.style.opacity           = `${random(0.4, 0.9)}`;
  drop.style.height            = `${random(10, 20)}px`;
  return drop;
}

// ── Snowflake ──
function createSnowflake() {
  const flake = document.createElement('div');
  flake.className = 'particle snowflake';
  flake.style.left              = `${random(0, 100)}%`;
  flake.style.animationDuration = `${random(3, 8)}s`;
  flake.style.animationDelay   = `${random(0, 5)}s`;
  flake.style.width             = `${random(4, 10)}px`;
  flake.style.height            = flake.style.width;
  flake.style.opacity           = `${random(0.5, 1)}`;
  flake.innerHTML               = '❄';
  flake.style.fontSize          = flake.style.width;
  return flake;
}

// ── Cloud ──
function createCloud(index) {
  const cloud = document.createElement('div');
  cloud.className = 'particle cloud-particle';
  cloud.style.top              = `${random(5, 40)}%`;
  cloud.style.animationDuration = `${random(20, 40)}s`;
  cloud.style.animationDelay  = `${index * -6}s`;
  cloud.style.opacity          = `${random(0.5, 0.9)}`;
  const size = random(80, 160);
  cloud.style.width            = `${size}px`;
  cloud.style.height           = `${size * 0.6}px`;
  return cloud;
}

// ── Fog layer ──
function createFog(index) {
  const fog = document.createElement('div');
  fog.className = 'particle fog-layer';
  fog.style.top              = `${20 + index * 15}%`;
  fog.style.animationDuration = `${random(15, 25)}s`;
  fog.style.animationDelay  = `${index * -4}s`;
  fog.style.opacity          = `${random(0.2, 0.45)}`;
  return fog;
}

// ── Wind line ──
function createWindLine() {
  const line = document.createElement('div');
  line.className = 'particle windline';
  line.style.top              = `${random(10, 90)}%`;
  line.style.width            = `${random(60, 180)}px`;
  line.style.animationDuration = `${random(1.5, 3)}s`;
  line.style.animationDelay  = `${random(0, 3)}s`;
  line.style.opacity          = `${random(0.2, 0.5)}`;
  return line;
}

// ── Lightning ──
function createLightning(container) {
  const bolt = document.createElement('div');
  bolt.className = 'particle lightning';
  container.appendChild(bolt);
}