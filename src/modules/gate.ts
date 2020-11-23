import utils from "../../node_modules/decentraland-ecs-utils/index"
import resources from "../resources"
import { Sound } from "./sound"
import { redrawRays } from "../modules/waterPuzzle/waterPuzzle"

const gateOpeningSound = new Sound(resources.sounds.gateOpening, false)

export class Gate extends Entity {
  private startPos: Vector3
  private endPos: Vector3

  constructor(model: GLTFShape) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(new Transform())
    this.startPos = this.getComponent(Transform).position
    this.endPos = new Vector3(this.startPos.x, this.startPos.y - 4.75, this.startPos.z)
  }
  openGate(): void {
    gateOpeningSound.getComponent(AudioSource).playOnce()
    this.addComponent(new utils.MoveTransformComponent(this.startPos, this.endPos, 3, () => {
      redrawRays() // Need to redraw moon rays as the ray path changes as the statue positions changes
    }))
  }
}
