import { Statue, StatueType } from "./statue"
import { Gate } from "../gate"
import { Sound } from "../sound"
import resources from "../../resources"
import utils from "../../../node_modules/decentraland-ecs-utils/index"
import { redrawRays } from "../waterPuzzle/waterPuzzle"

// Sounds
const statueMoveSound = new Sound(resources.sounds.statueMove, false)

// Blocked coordinates
const Y_OFFSET = 2.5
const blocked: Vector3[] = [new Vector3(25.5, Y_OFFSET, 39.75), new Vector3(25.5, Y_OFFSET, 33.75), new Vector3(25.5, Y_OFFSET, 27.75)]
const solution: Vector3[] = [new Vector3(31.5, Y_OFFSET, 39.75), new Vector3(28.5, Y_OFFSET, 39.75), new Vector3(31.5, Y_OFFSET, 27.75)]
const restartPos: Vector3[] = [new Vector3(22.5, Y_OFFSET, 30.75), new Vector3(22.5, Y_OFFSET, 33.75), new Vector3(22.5, Y_OFFSET, 36.75)]

// Earth gate
const earthGate = new Gate(resources.models.standard.earthGate)

// Statue
const statues: Statue[] = []
const statueShape = resources.models.earthFirePuzzles.statueEarth
const statueGlowShape = resources.models.earthFirePuzzles.statueEarthGlow

for (let i = 0; i < restartPos.length; i++) {
  const statue = new Statue(statueShape, statueGlowShape, new Transform({ position: restartPos[i] }), StatueType.Earth)
  statues.push(statue)
}

// Instance the input object
let isPuzzleSolved = false
const input = Input.instance
const MAX_DISTANCE = 6

// Button down event
input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
  if (isPuzzleSolved) return
  if (e.hit.meshName == "statue_collider") {
    let statue = engine.entities[e.hit.entityId] as Statue

    if (statue.statueType !== StatueType.Earth) return
    let statuePos = statue.getComponent(Transform).position
    let distance = Vector3.Distance(statuePos, Camera.instance.position)
    if (distance < MAX_DISTANCE) {
      let currentPos = statue.getComponent(Transform).position
      let endPos = currentPos.subtract(e.hit.normal.multiplyByFloats(3, 3, 3))

      // Checks if anything is blocking the statue's path
      let isOverlapped = statues.some((statue) => {
        return endPos.equals(statue.getComponent(Transform).position)
      })
      let isBlocked = blocked.some((block) => {
        return endPos.equals(block)
      })

      // Check boundaries
      if (endPos.x >= 19.5 && endPos.x <= 31.5 && endPos.z >= 1 && endPos.z >= 27.75 && endPos.z <= 39.75 && !isOverlapped && !isBlocked) {
        // Slide the statue to its endPos over half a second
        if (!statue.hasComponent(utils.MoveTransformComponent)) {
          statueMoveSound.getComponent(AudioSource).playOnce()
          statue.addComponent(
            new utils.MoveTransformComponent(currentPos, endPos, 0.5, () => {
              redrawRays() // Need to redraw moon rays as the ray path changes as the statue positions changes
              if (checkSolution()) puzzleCompleted()
            })
          )
        }
      }
    }
  }
})

function checkSolution(): boolean {
  let count = 0
  for (let i = 0; i < statues.length; i++) {
    for (let j = 0; j < solution.length; j++) {
      if (statues[i].getComponent(Transform).position.equals(solution[j])) {
        statues[i].toggleGlow(true)
        count++
        break
      } else {
        statues[i].toggleGlow(false)
      }
    }
  }
  log(count)
  if (count == 3) return true
  return false
}

function puzzleCompleted() {
  isPuzzleSolved = true
  earthGate.openGate()
}