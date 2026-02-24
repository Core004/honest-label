import { useEffect, useId, useState } from "react"

export function Sparkles({
  className,
  size = 1,
  minSize = null,
  density = 800,
  speed = 1,
  minSpeed = null,
  opacity = 1,
  opacitySpeed = 3,
  minOpacity = null,
  color = "#FFFFFF",
  background = "transparent",
  options = {},
}: {
  className?: string
  size?: number
  minSize?: number | null
  density?: number
  speed?: number
  minSpeed?: number | null
  opacity?: number
  opacitySpeed?: number
  minOpacity?: number | null
  color?: string
  background?: string
  options?: any
}) {
  const [isReady, setIsReady] = useState(false)
  const [ParticlesComponent, setParticlesComponent] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    async function loadParticles() {
      const [{ default: Particles, initParticlesEngine }, { loadSlim }] = await Promise.all([
        import("@tsparticles/react"),
        import("@tsparticles/slim"),
      ])
      await initParticlesEngine(async (engine) => {
        await loadSlim(engine)
      })
      if (!cancelled) {
        setParticlesComponent(() => Particles)
        setIsReady(true)
      }
    }
    loadParticles()
    return () => { cancelled = true }
  }, [])

  const id = useId()

  const defaultOptions = {
    background: {
      color: {
        value: background,
      },
    },
    fullScreen: {
      enable: false,
      zIndex: 1,
    },
    fpsLimit: 120,
    particles: {
      color: {
        value: color,
      },
      move: {
        enable: true,
        direction: "none",
        speed: {
          min: minSpeed || speed / 10,
          max: speed,
        },
        straight: false,
      },
      number: {
        value: density,
      },
      opacity: {
        value: {
          min: minOpacity || opacity / 10,
          max: opacity,
        },
        animation: {
          enable: true,
          sync: false,
          speed: opacitySpeed,
        },
      },
      size: {
        value: {
          min: minSize || size / 2.5,
          max: size,
        },
      },
    },
    detectRetina: true,
  }

  if (!isReady || !ParticlesComponent) return null

  return <ParticlesComponent id={id} options={{ ...defaultOptions, ...options }} className={className} />
}
