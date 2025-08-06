// components/Noise.tsx
export default function Noise() {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full">
      <svg className="h-full w-full" preserveAspectRatio="none" aria-hidden>
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            seed="2"
          >
            <animate
              attributeName="baseFrequency"
              dur="8s"
              values="0.70;0.80;0.70"
              repeatCount="indefinite"
            />
            <animate
              attributeName="seed"
              dur="12s"
              values="2;50;80;2"
              repeatCount="indefinite"
            />
          </feTurbulence>
        </filter>

        {/*  ❯ 10 % de folga em volta  */}
        <rect
          x="-10%" /* começa 10 % antes da tela */
          y="-10%"
          width="120%" /* cobre 120 % da largura/altura */
          height="120%"
          filter="url(#noiseFilter)"
          opacity="0.10"
        >
          {/* drift diagonal suave em % (escala com o viewport) */}
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="40s"
            values="0 0; -5% -3%; 0 0"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
}
