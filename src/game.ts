import resources from "./resources"
import { Sound } from "./modules/sound"

const base = new Entity()
base.addComponent(resources.models.standard.base)
engine.addEntity(base)

const building = new Entity()
building.addComponent(resources.models.standard.building)
engine.addEntity(building)

Input.instance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
  log(`pos: `, Camera.instance.position)
})

// Add ambient sounds
const nightAmbienceSound = new Sound(resources.sounds.nightAmbience, true, new Vector3(24, 16, 24))
nightAmbienceSound.getComponent(AudioSource).loop = true
nightAmbienceSound.getComponent(AudioSource).playing = true