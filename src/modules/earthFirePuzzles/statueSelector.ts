import resources from "../../resources"

// Selector
const statueSelectorHand = new Entity()
statueSelectorHand.addComponent(resources.models.earthFirePuzzles.statueSelectorHand)
statueSelectorHand.addComponent(new Transform())
statueSelectorHand.getComponent(Transform).scale.setAll(0)
engine.addEntity(statueSelectorHand)

const statueSelectorGlow = new Entity()
statueSelectorGlow.addComponent(resources.models.earthFirePuzzles.statueSelectorGlow)
statueSelectorGlow.addComponent(new Transform())
statueSelectorGlow.getComponent(Transform).scale.setAll(0)
engine.addEntity(statueSelectorGlow)

const MAX_DISTANCE =  4 // NOTE: should be 6 but raycasting calc is off
const SELECTOR_HAND_Y_OFFSET = 1.35
const BOX_WIDTH = 3

// System that casts the rays to generate selector
class SelectorSystem implements ISystem {
  update() {
    // Ray from camera
    const rayFromCamera = PhysicsCast.instance.getRayFromCamera(MAX_DISTANCE)

    // For the camera ray, we cast a hit all
    PhysicsCast.instance.hitFirst(rayFromCamera, (raycastHitEntity) => {
      if (raycastHitEntity.entity.meshName == "statue_collider") {
        let entityID = raycastHitEntity.entity.entityId
        pickerFace(engine.entities[entityID], raycastHitEntity)
      } else {
        statueSelectorHand.getComponent(Transform).scale.setAll(0)
        statueSelectorGlow.getComponent(Transform).scale.setAll(0)
      }
    })
  }
}

// Adds systems to the engine
engine.addSystem(new SelectorSystem())

// Snaps the hand icon to discrete points on the mirror selector
function pickerFace(entity: IEntity, raycastHitEntity: RaycastHitEntity) {
  let transform = entity.getComponent(Transform).position.clone() // Clone position of the hit object
  
  statueSelectorGlow.getComponent(Transform).position = transform.clone()
  statueSelectorGlow.getComponent(Transform).position.y = transform.y
  statueSelectorGlow.getComponent(Transform).scale.setAll(1)

  statueSelectorHand.getComponent(Transform).position = transform // Set selector transform to match the object
  statueSelectorHand.getComponent(Transform).position.y = transform.y + SELECTOR_HAND_Y_OFFSET
  statueSelectorHand.getComponent(Transform).scale.setAll(1)
  
  let statueSelectorRotation = statueSelectorHand.getComponent(Transform).rotation
  if (raycastHitEntity.hitNormal.x > 0) {
    statueSelectorRotation = Quaternion.Euler(0, 90, 0)
    statueSelectorHand.getComponent(Transform).position.x = transform.x + BOX_WIDTH / 1.99
  } else if (raycastHitEntity.hitNormal.x < 0) {
    statueSelectorRotation = Quaternion.Euler(0, -90, 0)
    statueSelectorHand.getComponent(Transform).position.x = transform.x - BOX_WIDTH / 1.99
  }
  if (raycastHitEntity.hitNormal.z > 0) {
    statueSelectorRotation = Quaternion.Euler(0, 0, 0)
    statueSelectorHand.getComponent(Transform).position.z = transform.z + BOX_WIDTH / 1.99
  } else if (raycastHitEntity.hitNormal.z < 0) {
    statueSelectorRotation = Quaternion.Euler(0, 180, 0)  
    statueSelectorHand.getComponent(Transform).position.z = transform.z - BOX_WIDTH / 1.99
  }
  statueSelectorHand.getComponent(Transform).rotation = statueSelectorRotation
}
