import { Gate } from "../gate"
import resources from "../../resources"
import utils from "../../../node_modules/decentraland-ecs-utils/index"
import { Mirror } from "./mirror"
import { ReflectedRay } from "../reflectedRay"
import { Sound } from "../sound"

// Sounds
const mirrorMoveSound = new Sound(resources.sounds.mirrorMove, false)

// Water gate
const waterGate = new Gate(resources.models.standard.waterGate)

// Vectors
const blocked: Vector3[] = [
  /// --- Left Side ---
  // Torch
  new Vector3(4.5, 2, 8.5),

  // Right edge
  new Vector3(13.5, 2, 8.5),
  new Vector3(13.5, 2, 9.5),
  new Vector3(13.5, 2, 10.5),
  new Vector3(13.5, 2, 11.5),
  new Vector3(13.5, 2, 12.5),
  new Vector3(13.5, 2, 13.5),
  new Vector3(13.5, 2, 14.5),
  new Vector3(13.5, 2, 15.5),
  new Vector3(13.5, 2, 16.5),
  new Vector3(13.5, 2, 17.5),
  new Vector3(13.5, 2, 18.5),
  new Vector3(13.5, 2, 19.5),
  new Vector3(13.5, 2, 20.5),
  new Vector3(13.5, 2, 21.5),
  new Vector3(13.5, 2, 22.5),

  // Wall
  new Vector3(12.5, 2, 23.5),
  new Vector3(11.5, 2, 23.5),
  new Vector3(11.5, 2, 24.5),

  // Step
  new Vector3(11.5, 2, 25.5),
  new Vector3(11.5, 2, 26.5),
  new Vector3(11.5, 2, 27.5),
  new Vector3(11.5, 2, 28.5),
  new Vector3(11.5, 2, 29.5),
  new Vector3(11.5, 2, 30.5),
  new Vector3(11.5, 2, 31.5),
  new Vector3(11.5, 2, 32.5),
  new Vector3(11.5, 2, 33.5),
  new Vector3(11.5, 2, 34.5),
  new Vector3(11.5, 2, 35.5),
  new Vector3(11.5, 2, 36.5),
  new Vector3(11.5, 2, 37.5),
  new Vector3(11.5, 2, 38.5),
  new Vector3(11.5, 2, 39.5),
  new Vector3(11.5, 2, 40.5),
  new Vector3(11.5, 2, 41.5),
  new Vector3(11.5, 2, 42.5),
  new Vector3(11.5, 2, 43.5),

  // Arch 1
  new Vector3(11.5, 2, 29.5),
  new Vector3(11.5, 2, 30.5),
  new Vector3(11.5, 2, 31.5),
  new Vector3(10.5, 2, 29.5),
  new Vector3(10.5, 2, 30.5),
  new Vector3(10.5, 2, 31.5),

  // Arch 2
  new Vector3(6.5, 2, 29.5),
  new Vector3(6.5, 2, 30.5),
  new Vector3(6.5, 2, 31.5),
  new Vector3(5.5, 2, 29.5),
  new Vector3(5.5, 2, 30.5),
  new Vector3(5.5, 2, 31.5),
  new Vector3(4.5, 2, 29.5),
  new Vector3(4.5, 2, 30.5),
  new Vector3(4.5, 2, 31.5),

  // Broken pillars
  new Vector3(9.5, 2, 42.5),
  new Vector3(9.5, 2, 43.5),
  new Vector3(8.5, 2, 42.5),
  new Vector3(8.5, 2, 43.5),
  new Vector3(7.5, 2, 42.5),
  new Vector3(7.5, 2, 43.5),
  new Vector3(6.5, 2, 42.5),
  new Vector3(6.5, 2, 43.5),

  // Torch2
  new Vector3(4.5, 2, 43.5),

  /// --- Right Side Rear ---
  // Left edge
  new Vector3(37.5, 2, 43.5),
  new Vector3(37.5, 2, 41.5),
  new Vector3(37.5, 2, 37.5),
  new Vector3(37.5, 2, 36.5),
  new Vector3(37.5, 2, 35.5),
  new Vector3(37.5, 2, 34.5),
  new Vector3(37.5, 2, 33.5),
  new Vector3(37.5, 2, 32.5),
  new Vector3(37.5, 2, 31.5),
  new Vector3(37.5, 2, 30.5),
  new Vector3(37.5, 2, 29.5),
  new Vector3(37.5, 2, 28.5),
  new Vector3(37.5, 2, 27.5),
  new Vector3(37.5, 2, 26.5),

  // Torch 3
  new Vector3(38.5, 2, 42.5),

  // Large pillar
  new Vector3(39.5, 2, 40.5),
  new Vector3(39.5, 2, 39.5),
  new Vector3(39.5, 2, 38.5),
  new Vector3(38.5, 2, 40.5),
  new Vector3(38.5, 2, 39.5),
  new Vector3(38.5, 2, 38.5),

  // Torch 4
  new Vector3(43.5, 2, 36.5),

  // Bottom edge
  new Vector3(43.5, 2, 25.5),
  new Vector3(42.5, 2, 25.5),
  new Vector3(41.5, 2, 25.5),
  // new Vector3(40.5, 2, 25.5),
  // new Vector3(39.5, 2, 25.5),
  new Vector3(38.5, 2, 25.5),

  // Path
  new Vector3(41.5, 2, 24.5),
  new Vector3(41.5, 2, 23.5),
  new Vector3(41.5, 2, 22.5),
  new Vector3(38.5, 2, 24.5),
  new Vector3(38.5, 2, 23.5),
  new Vector3(38.5, 2, 22.5),

  /// --- Right Side Front ---
  // Top edge
  new Vector3(35.5, 2, 21.5),
  new Vector3(36.5, 2, 21.5),
  new Vector3(37.5, 2, 21.5),
  new Vector3(38.5, 2, 21.5),
  // new Vector3(39.5, 2, 21.5),
  // new Vector3(40.5, 2, 21.5),
  new Vector3(41.5, 2, 21.5),
  new Vector3(42.5, 2, 21.5),
  new Vector3(43.5, 2, 21.5),

  // Left edge
  new Vector3(34.5, 2, 20.5),
  new Vector3(34.5, 2, 19.5),
  new Vector3(34.5, 2, 18.5),
  new Vector3(34.5, 2, 17.5),
  new Vector3(34.5, 2, 16.5),
  new Vector3(34.5, 2, 15.5),
  new Vector3(34.5, 2, 14.5),
  new Vector3(34.5, 2, 13.5),
  new Vector3(34.5, 2, 12.5),
  new Vector3(34.5, 2, 11.5),
  new Vector3(34.5, 2, 10.5),
  new Vector3(34.5, 2, 9.5),
  new Vector3(34.5, 2, 8.5),

  // Torch 5
  new Vector3(43.5, 2, 8.5),

  // Broken column
  new Vector3(39.5, 2, 11.5),
  new Vector3(38.5, 2, 11.5),
  new Vector3(38.5, 2, 10.5),
  new Vector3(39.5, 2, 10.5),
  new Vector3(40.5, 2, 10.5),
  new Vector3(39.5, 2, 9.5),
  new Vector3(40.5, 2, 9.5),
]

// Mirrors
//#region
const mirrorSelectorShape = resources.models.waterPuzzle.mirrorSelector
// Colliders have been scaled up as the raycasting is happening above the player's head
const mirrorShape = resources.models.waterPuzzle.mirrorScaledColliders
// Workaround: issue with the selector when rotating the models so require the models to be rotated
const mirrorShapeRotated = resources.models.waterPuzzle.mirrorScaledCollidersRotated
const mirrors: Mirror[] = []

const mirrorA = new Mirror(mirrorSelectorShape, mirrorShapeRotated, new Transform({ position: new Vector3(8.5, 2, 10.5) }))
mirrors.push(mirrorA)

const mirrorB = new Mirror(mirrorSelectorShape, mirrorShape, new Transform({ position: new Vector3(12.5, 2, 16.5) }))
mirrors.push(mirrorB)

const mirrorC = new Mirror(mirrorSelectorShape, mirrorShape, new Transform({ position: new Vector3(42.5, 2, 41.5) }))
mirrors.push(mirrorC)

const mirrorD = new Mirror(mirrorSelectorShape, mirrorShapeRotated, new Transform({ position: new Vector3(36.5, 2, 15.5) }))
mirrors.push(mirrorD)

//#endregion

// Instance the input object
let isPuzzleSolved = false
const input = Input.instance
const MAX_DISTANCE = 4

// Delay dummy entity
const delayDummyEntity = new Entity()
engine.addEntity(delayDummyEntity)

// Button down event
input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
  if (isPuzzleSolved) return
  if (e.hit.meshName == "mirrorSelector_collider") {
    let mirrorStand = engine.entities[e.hit.entityId]
    let mirrorStandPos = mirrorStand.getComponent(Transform).position
    let distance = Vector3.Distance(mirrorStandPos, Camera.instance.position)

    if (distance < MAX_DISTANCE) {
      let currentPos = mirrorStand.getComponent(Transform).position
      let endPos = currentPos.subtract(e.hit.normal)

      // Checks if at least one mirror in the array is blocking its path
      let mirrorOverlap = mirrors.some((mirror) => {
        return endPos.equals(mirror.getComponent(Transform).position)
      })
      let isBlocked = blocked.some((block) => {
        return endPos.equals(block)
      })

      log(endPos)

      // Check boundaries
      if (endPos.x >= 4.5 && endPos.x <= 43.5 && endPos.z >= 8.5 && endPos.z <= 43.5 && !mirrorOverlap && !isBlocked) {
        // Slide the mirror to its endPos over half a second
        if (!mirrorStand.hasComponent(utils.MoveTransformComponent)) {
          mirrorMoveSound.getComponent(AudioSource).playOnce()
          mirrorStand.addComponent(
            new utils.MoveTransformComponent(currentPos, endPos, 0.5, () => {
              delayDummyEntity.addComponentOrReplace(
                new utils.Delay(100, () => {
                  redrawRays() // Redraw
                })
              )
            })
          )
        }
      }
    }
  }
})

input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (e) => {
  if (isPuzzleSolved) return
  if (e.hit.meshName == "mirrorSelector_collider") {
    let mirrorStand = engine.entities[e.hit.entityId] as Mirror
    let mirrorStandPos = mirrorStand.getComponent(Transform).position
    let distance = Vector3.Distance(mirrorStandPos, Camera.instance.position)

    if (distance < MAX_DISTANCE) {
      rotateMirror(mirrorStand, 45)
    }
  }
})

input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, true, (e) => {
  if (isPuzzleSolved) return
  if (e.hit.meshName == "mirrorSelector_collider") {
    let mirrorStand = engine.entities[e.hit.entityId] as Mirror
    let mirrorStandPos = mirrorStand.getComponent(Transform).position
    let distance = Vector3.Distance(mirrorStandPos, Camera.instance.position)

    if (distance < MAX_DISTANCE) {
      rotateMirror(mirrorStand, -45)
    }
  }
})

function rotateMirror(mirrorStand: Mirror, rotateAngle: number) {
  let mirror = mirrorStand.getMirror()

  if (!mirror.hasComponent(utils.RotateTransformComponent)) {
    let currentRot = mirror.getComponent(Transform).rotation
    let endRot = Quaternion.Euler(0, (mirrorStand.rotation += rotateAngle), 0)
    mirrorMoveSound.getComponent(AudioSource).playOnce()
    mirror.addComponent(
      new utils.RotateTransformComponent(currentRot, endRot, 0.5, () => {
        delayDummyEntity.addComponentOrReplace(
          new utils.Delay(100, () => {
            redrawRays() // Redraw
          })
        )
      })
    )
  }
}

// Ray
const rayTarget = new Entity()
rayTarget.addComponent(new GLTFShape("models/waterPuzzle/rayTarget.glb"))
rayTarget.addComponent(new Transform({ position: new Vector3(32.5, 2, 12.5), rotation: Quaternion.Euler(0, -90, 0) }))
engine.addEntity(rayTarget)

let physicsCast = PhysicsCast.instance
let reflectedRays: ReflectedRay[] = [] // Store reflected rays

// Ray emitter
let originPos = new Vector3(15.5, 6.5, 16.5)
let direction = Vector3.Left()

let ray: Ray = {
  origin: originPos,
  direction: direction,
  distance: 100,
}
const rayShape = new GLTFShape("models/waterPuzzle/rayOffsetY.glb") // Offset in y to avoid affecting the raycasting hitting player
const sourceRay = new ReflectedRay(rayShape, originPos, direction)
sourceRay.getComponent(Transform).rotate(Vector3.Up(), -90)

export function redrawRays(): void {
  if (isPuzzleSolved) return
  physicsCast.hitFirst(ray, (e) => {
    // Delete previous ray models
    while (reflectedRays.length > 0) {
      let ray = reflectedRays.pop()
      engine.removeEntity(ray)
    }
    // Workaround: ray hits an blank collider when the scene loads
    if (e.entity.meshName == "") {
      redrawRays()
      return
    }
    if (e.entity.meshName == "mirror_collider") {
      let reflectedVector: Vector3 = reflectVector(direction, new Vector3(e.hitNormal.x, e.hitNormal.y, e.hitNormal.z))
      reflectRay(new Vector3(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z), reflectedVector)
    }
    let distance = Vector3.Distance(ray.origin, e.hitPoint)
    sourceRay.getComponent(Transform).scale.z = distance
  })
}

// Recursive function for reflecting a ray every time it hits a mirror
function reflectRay(hitPoint: Vector3, reflectedVector: Vector3): void {
  const reflectedRay = new ReflectedRay(rayShape, hitPoint, reflectedVector)
  reflectedRay.getComponent(Transform).position = hitPoint
  let reflectedTarget = hitPoint.clone().add(reflectedVector)
  reflectedRay.getComponent(Transform).lookAt(reflectedTarget)
  reflectedRays.push(reflectedRay)

  physicsCast.hitFirst(reflectedRay.ray, (event) => {
    let distance = Vector3.Distance(reflectedRay.ray.origin, event.hitPoint)
    reflectedRay.getComponent(Transform).scale.z = distance

    if (event.entity.meshName == "mirror_collider") {
      let reflectedVector: Vector3 = reflectVector(
        new Vector3(reflectedRay.ray.direction.x, reflectedRay.ray.direction.y, reflectedRay.ray.direction.z),
        new Vector3(event.hitNormal.x, event.hitNormal.y, event.hitNormal.z)
      )
      reflectRay(new Vector3(event.hitPoint.x, event.hitPoint.y, event.hitPoint.z), reflectedVector)
    } else if (event.entity.meshName == "rayTarget_collider") {
      puzzleCompleted()
    }
  })
}

// Put in the direction of the previous ray and the normal of the raycast's hitpoint
function reflectVector(incident: Vector3, normal: Vector3): Vector3 {
  let dot = 2 * Vector3.Dot(incident, normal)
  let reflected = incident.subtract(normal.multiplyByFloats(dot, dot, dot))
  return reflected
}

function puzzleCompleted(): void {
  isPuzzleSolved = true
  waterGate.openGate() // Win condition
}

redrawRays()
