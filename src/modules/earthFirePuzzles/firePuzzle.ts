import { Statue, StatueType } from "./statue"
import { Sound } from "../sound"
import { LightningOrb } from "../windPuzzle/lightningOrb"
import resources from "../../resources"
import utils from "../../../node_modules/decentraland-ecs-utils/index"

// Sounds
const statueMoveSound = new Sound(resources.sounds.statueMove, false)

// Lightning orb
export const lightningOrb = new LightningOrb()

// Blocked coordinates
const Y_OFFSET = 11.25
const blocked: Vector3[] = [new Vector3(18, Y_OFFSET, 28.5), new Vector3(30, Y_OFFSET, 31.5)]
const solution: Vector3[] = [new Vector3(18, Y_OFFSET, 25.5), new Vector3(30, Y_OFFSET, 25.5), new Vector3(30, Y_OFFSET, 28.5), new Vector3(30, Y_OFFSET, 34.5)]
const restartPos: Vector3[] = [
  new Vector3(24, Y_OFFSET, 25.5),
  new Vector3(24, Y_OFFSET, 28.5),
  new Vector3(21, Y_OFFSET, 28.5),
  new Vector3(21, Y_OFFSET, 31.5),
]

// Statue
const statues: Statue[] = []
const statueShape = resources.models.earthFirePuzzles.statueFire
const statueGlowShape = resources.models.earthFirePuzzles.statueFireGlow

const statueShapeRotated = resources.models.earthFirePuzzles.statueFireRotated

// Workaround: issue with the selector when rotating the models so require the models to be rotated
const statueGlowShapeRotated = resources.models.earthFirePuzzles.statueFireGlowRotated

for (let i = 0; i < restartPos.length; i++) {
  let statue
  if (i == 0) {
    statue = new Statue(statueShapeRotated, statueGlowShapeRotated, new Transform({ position: restartPos[i] }), StatueType.Fire)
  } else {
    statue = new Statue(statueShape, statueGlowShape, new Transform({ position: restartPos[i] }), StatueType.Fire)
  }
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
    if (statue.statueType !== StatueType.Fire) return

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
      if (endPos.x >= 18 && endPos.x <= 30 && endPos.z >= 1 && endPos.z >= 25.5 && endPos.z <= 34.5 && !isOverlapped && !isBlocked) {
        // Slide the statue to its endPos over half a second
        if (!statue.hasComponent(utils.MoveTransformComponent)) {
          statueMoveSound.getComponent(AudioSource).playOnce()
          statue.addComponent(
            new utils.MoveTransformComponent(currentPos, endPos, 0.5, () => {
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
  if (count == 4) return true
  return false
}

function resetGame(): void {
  for (let i = 0; i < statues.length; i++) {
    statues[i].getComponent(Transform).position = restartPos[i]
    statues[i].toggleGlow(false)
  }
}

function puzzleCompleted(): void {
  isPuzzleSolved = true
  lightningOrb.spawn()
  resetSwitch.removeComponent(OnPointerDown)
}

// Reset switch
const resetSwitch = new Entity()
resetSwitch.addComponent(resources.models.earthFirePuzzles.resetSwitch)
resetSwitch.addComponent(new Transform({ position: new Vector3(26.66, 12.7, 35.9)}))
engine.addEntity(resetSwitch)

resetSwitch.addComponent(
  new OnPointerDown(
    (e) => {
      resetGame()
      statueMoveSound.getComponent(AudioSource).playOnce()
    },
    {
      button: ActionButton.PRIMARY,
      showFeedback: true,
      hoverText: "Reset Puzzle",
      distance: 4
    }
  )
)
