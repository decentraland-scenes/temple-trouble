import resources from "../../resources"
import { Sound } from "../sound"

// Sounds
const portalOpenSound = new Sound(resources.sounds.portalOpen, false)
const portalSound = new Sound(resources.sounds.portal, true, new Vector3(24, 19.2, 25.5))

// Portal
const portalPosition = new Vector3(24, 19.25, 25.5)
const portal = new Entity()
portal.addComponent(resources.models.windPuzzle.portalMain)
portal.addComponent(new Transform({ position: portalPosition }))
portal.getComponent(GLTFShape).visible = false
engine.addEntity(portal)

const portalSwirls = new Entity()
portalSwirls.addComponent(resources.models.windPuzzle.portalSwirls)
portalSwirls.addComponent(new Transform({ position: portalPosition }))
portalSwirls.getComponent(GLTFShape).visible = false
engine.addEntity(portalSwirls)

const portalStrips = new Entity()
portalStrips.addComponent(resources.models.windPuzzle.portalStrips)
portalStrips.addComponent(new Transform({ position: portalPosition }))
portalStrips.getComponent(GLTFShape).visible = false
engine.addEntity(portalStrips)

export function loadPortal(): void {
  portalOpenSound.getComponent(AudioSource).playOnce()
  portalSound.getComponent(AudioSource).playing = true

  portal.getComponent(GLTFShape).visible = true
  portalSwirls.getComponent(GLTFShape).visible = true
  portalStrips.getComponent(GLTFShape).visible = true

  let particleHeight = 5

  @Component("particle")
  class Particle {
    life = Math.random()
    seed = Math.random() * particleHeight
    size = Math.random() * 0.1
    constructor(public origin: Vector3) {}
  }

  const material = new Material()
  material.emissiveColor = new Color3(0, 2, 1.25)

  class ParicleSystem {
    group = engine.getComponentGroup(Particle)
    update(dt: number) {
      shape.visible = true
      for (const entity of this.group.entities) {
        const particle = entity.getComponent(Particle)
        const transform = entity.getComponent(Transform)
        particle.life += dt / 5
        particle.life %= 1
        transform.position = new Vector3(
          particle.origin.x + Math.sin((particle.life + particle.seed) * 5) * (1 - particle.life / 1.5) * 10,
          particle.origin.y + particle.seed,
          particle.origin.z + Math.cos((particle.life + particle.seed) * 5) * (1 - particle.life / 1.5) * 10
        )
        transform.scale.setAll(particle.size)
      }
    }
  }

  const particles: Entity[] = []
  const origin = portalPosition
  const shape = new SphereShape()
  shape.withCollisions = false
  const MAX_PARTICLES = 64

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const particle = new Entity()
    particle.addComponent(shape)
    particle.addComponent(material)
    particle.addComponent(new Particle(origin))
    particle.addComponent(new Transform({ position: origin }))
    engine.addEntity(particle)
    particles.push(particle)
  }

  engine.addSystem(new ParicleSystem())
}
