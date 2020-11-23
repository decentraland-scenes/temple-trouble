import { Sound } from "../sound"
import resources from "../../resources"

const orbSpawnSound = new Sound(resources.sounds.orbSpawn, false)
const orbPickupSound = new Sound(resources.sounds.orbPickup, false)

const orbEffect = new Entity()
orbEffect.addComponent(resources.models.windPuzzle.orbEffect)
orbEffect.addComponent(new Transform())
engine.addEntity(orbEffect)

export class LightningOrb extends Entity {
  public isPickedUp: boolean = false

  constructor() {
    super()
    engine.addEntity(this)
    this.addComponent(resources.models.windPuzzle.lightningOrb)
    this.addComponent(new Transform({ position: new Vector3(23.9, 13.5, 41.35) }))
    this.getComponent(Transform).scale.setAll(0)
    this.addComponent(new Animator())
    this.getComponent(Animator).addClip(new AnimationState("Spawning", { looping: false }))
    this.getComponent(Animator).addClip(new AnimationState("PickingUp", { looping: false }))

    this.addComponent(
      new OnPointerDown(
        () => {
          this.pickUp()
        },
        { hoverText: "Pick up", distance: 4, button: ActionButton.PRIMARY }
      )
    )
    orbEffect.setParent(this)
  }

  spawn(): void {
    orbSpawnSound.getComponent(AudioSource).playOnce()
    this.getComponent(Transform).scale.setAll(1)
    this.stopAnimations()
    this.getComponent(Animator).getClip("Spawning").play()
  }

  pickUp(): void {
    this.isPickedUp = true
    orbPickupSound.getComponent(AudioSource).playOnce()
    engine.removeEntity(orbEffect)
    this.getComponent(Transform).position = new Vector3(0, -0.5, 0.75) // Offset from first person camera view
    this.setParent(Attachable.FIRST_PERSON_CAMERA)
    this.stopAnimations()
    this.getComponent(Animator).getClip("PickingUp").play()
  }
  drop(): void {
    this.isPickedUp = false
    this.getComponent(Transform).scale.setAll(0)
    this.setParent(null)
  }

  // Bug workaround: otherwise the next animation clip won't play
  stopAnimations() {
    this.getComponent(Animator).getClip("Spawning").stop()
    this.getComponent(Animator).getClip("PickingUp").stop()
  }
}
