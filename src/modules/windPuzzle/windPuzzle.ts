// TODO: Add sound for lightning orb and for each time the light reflects (use sound from zenquencer scene)

import { ReflectedRay } from "../reflectedRay"
import { FloatingRock } from "./floatingRock"
import { Sound } from "../sound"
import { lightningOrb } from "../earthFirePuzzles/firePuzzle"
import { loadPortal } from "../windPuzzle/portal"
import resources from "../../resources"
import utils from "../../../node_modules/decentraland-ecs-utils/index"

// Sounds
const firstNote = new Sound(resources.sounds.firstNote, false)
const secondNote = new Sound(resources.sounds.secondNote, false)
const thirdNote = new Sound(resources.sounds.thirdNote, false)
const forthNote = new Sound(resources.sounds.forthNote, false)
const lightningSound = new Sound(resources.sounds.ligtningOrb, false)

// Rocks
const floatingRocks: FloatingRock[] = []
const floatingWindRock = new FloatingRock(
  resources.models.windPuzzle.floatingWindRock,
  resources.models.windPuzzle.floatingWindRockGlow,
  new Transform({ position: new Vector3(18.75, 22, 25.5), rotation: Quaternion.Euler(0, 90, 0) })
)
floatingRocks.push(floatingWindRock)

const floatingFireRock = new FloatingRock(
  resources.models.windPuzzle.floatingFireRock,
  resources.models.windPuzzle.floatingFireRockGlow,
  new Transform({ position: new Vector3(24, 23, 20.5), rotation: Quaternion.Euler(0, 0, 0) })
)
floatingRocks.push(floatingFireRock)

const floatingWaterRock = new FloatingRock(
  resources.models.windPuzzle.floatingWaterRock,
  resources.models.windPuzzle.floatingWaterRockGlow,
  new Transform({ position: new Vector3(29.25, 24, 25.5), rotation: Quaternion.Euler(0, -90, 0) })
)
floatingRocks.push(floatingWaterRock)

const floatingEarthRock = new FloatingRock(
  resources.models.windPuzzle.floatingEarthRock,
  resources.models.windPuzzle.floatingEarthRockGlow,
  new Transform({ position: new Vector3(24, 25, 30.75), rotation: Quaternion.Euler(0, 180, 0) })
)

floatingRocks.push(floatingEarthRock)

const rayShape = resources.models.windPuzzle.ray

const ray = new Entity()
ray.addComponent(rayShape)
ray.addComponent(new Transform({ position: new Vector3(8, 1.25, 8), scale: Vector3.Zero() }))
engine.addEntity(ray)

// Reflect
const reflectedRays: ReflectedRay[] = []
const rayDelayEntity = new Entity()
engine.addEntity(rayDelayEntity)
let reflectCount = 0

// Input
let isPuzzleSolved = false
const input = Input.instance
let physicsCast = PhysicsCast.instance
let forwardVector: Vector3 = Vector3.Forward().rotate(Camera.instance.rotation)

// Left mouse button
input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
  if (!lightningOrb.isPickedUp || isPuzzleSolved) return
  lightningSound.getComponent(AudioSource).playOnce()

  // Switch off all rock glows
  for (let rock of floatingRocks) {
    rock.toggleGlow(false)
  }

  if (e.hit.meshName == "mirror_collider") {
    // Delete previous reflected rays and temp entities
    while (reflectedRays.length > 0) {
      let reflectedRay = reflectedRays.pop()
      engine.removeEntity(reflectedRay)
    }
    reflectCount = 0
    let rockMirror = engine.entities[e.hit.entityId] as FloatingRock
    rockMirror.toggleGlow(true) // Turn on glow for the rock that's just been hit
    forwardVector = Vector3.Forward().rotate(Camera.instance.rotation) // Update forward vector
    let reflectedVector: Vector3 = reflectVector(forwardVector, e.hit.normal)

    // NEEDS REFACTORING
    let forwardVec = Vector3.Forward().scale(1).rotate(Camera.instance.rotation)
    let startPosition = Camera.instance.position.clone().add(forwardVec)
    let distanceFromCamera = Vector3.Distance(startPosition, e.hit.hitPoint)

    // Ray
    ray.getComponent(Transform).position = startPosition
    ray.getComponent(Transform).position.y -= 0.5 // Offset ray
    ray.getComponent(Transform).lookAt(e.hit.hitPoint)
    let startSize = ray.getComponent(Transform).scale.setAll(1)

    // Scale the ray to size
    let endSize = new Vector3(startSize.x, startSize.y, distanceFromCamera)
    ray.addComponentOrReplace(
      new utils.ScaleTransformComponent(startSize, endSize, 0.1, () => {
        reflectRay(e.hit.hitPoint, reflectedVector)
      })
    )
    // Ray dissipates after half a second
    rayDelayEntity.addComponentOrReplace(
      new utils.Delay(500, () => {
        ray.addComponentOrReplace(new utils.ScaleTransformComponent(endSize, new Vector3(0, 0, endSize.z), 0.2))
      })
    )
  } else {
    // NEEDS REFACTORING
    let forwardVec = Vector3.Forward().scale(1).rotate(Camera.instance.rotation)
    let startPosition = Camera.instance.position.clone().add(forwardVec)
    ray.getComponent(Transform).position = startPosition
    ray.getComponent(Transform).position.y -= 0.5 // Offset ray
    forwardVector = Vector3.Forward().scale(5).rotate(Camera.instance.rotation) // Update forward vector
    let newPos: Vector3 = Camera.instance.position.clone().add(forwardVector)
    ray.getComponent(Transform).lookAt(newPos)
    let startSize = ray.getComponent(Transform).scale.setAll(1)

    // Scale the ray to size
    let endSize = new Vector3(startSize.x, startSize.y, 4)
    ray.addComponentOrReplace(new utils.ScaleTransformComponent(startSize, endSize, 0.1))
    // Ray dissipates after half a second
    rayDelayEntity.addComponentOrReplace(
      new utils.Delay(500, () => {
        ray.addComponentOrReplace(new utils.ScaleTransformComponent(endSize, new Vector3(0, 0, endSize.z), 0.2))
      })
    )
  }
})

// Recursive function for reflecting a ray every time it hits a rock mirror
function reflectRay(hitPoint: Vector3, reflectedVector: Vector3) {
  // Reflect entity to run expire function
  const reflectExpireEntity = new Entity()
  engine.addEntity(reflectExpireEntity)

  // Reflected ray
  const reflectedRay = new ReflectedRay(rayShape, hitPoint, reflectedVector)
  reflectedRay.getComponent(Transform).position = hitPoint
  let reflectedTarget = hitPoint.clone().add(reflectedVector)
  reflectedRay.getComponent(Transform).lookAt(reflectedTarget)
  reflectedRays.push(reflectedRay)

  // Update reflect count
  reflectCount++
  playNote(reflectCount)

  physicsCast.hitFirst(reflectedRay.ray, (e) => {
    let distance = Vector3.Distance(reflectedRay.ray.origin, e.hitPoint)
    let startSize = reflectedRay.getComponent(Transform).scale

    // Scale reflected ray to size
    let endSize = new Vector3(startSize.x, startSize.y, distance)
    let timeToTravel = distance * 0.05
    reflectedRay.addComponentOrReplace(
      new utils.ScaleTransformComponent(startSize, endSize, timeToTravel, () => {
        if (e.entity.meshName == "mirror_collider") {
          let rockMirror = engine.entities[e.entity.entityId] as FloatingRock
          rockMirror.toggleGlow(true) // Turn on glow for rock
          let reflectedVector: Vector3 = reflectVector(
            new Vector3(reflectedRay.ray.direction.x, reflectedRay.ray.direction.y, reflectedRay.ray.direction.z),
            new Vector3(e.hitNormal.x, e.hitNormal.y, e.hitNormal.z)
          )
          reflectRay(new Vector3(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z), reflectedVector)
        }
      })
    )
    // Reflected ray dissipates after a period proportional to the travelled distance
    reflectExpireEntity.addComponentOrReplace(
      new utils.ExpireIn(1000 * timeToTravel, () => {
        reflectedRay.addComponentOrReplace(new utils.ScaleTransformComponent(endSize, new Vector3(0, 0, endSize.z), 0.5))
      })
    )
  })
}

// Put in the direction of the previous ray and the normal of the raycast's hitpoint
function reflectVector(incident: Vector3, normal: Vector3): Vector3 {
  let dot = 2 * Vector3.Dot(incident, normal)
  let reflected = incident.subtract(normal.multiplyByFloats(dot, dot, dot))
  return reflected
}

function playNote(reflectCount: number): void {
  // TODO: There's a delay when playing the notes
  switch (reflectCount) {
    case 1:
      firstNote.getComponent(AudioSource).playOnce()
      break
    case 2:
      secondNote.getComponent(AudioSource).playOnce()
      break
    case 3:
      thirdNote.getComponent(AudioSource).playOnce()
      break
    case 4:
      forthNote.getComponent(AudioSource).playOnce()
      puzzleCompleted()
      break
    default:
      break
  }
}

function puzzleCompleted(): void {
  isPuzzleSolved = true
  lightningOrb.drop()
  loadPortal()
}
