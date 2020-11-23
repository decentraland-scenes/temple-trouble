import resources from "../../resources"

// Selector
const mirrorSelectorHand = new Entity()
mirrorSelectorHand.addComponent(resources.models.waterPuzzle.mirrorSelectorHand)
mirrorSelectorHand.addComponent(new Transform())
mirrorSelectorHand.getComponent(Transform).scale.setAll(0)
engine.addEntity(mirrorSelectorHand)

const mirrorSelectorGlow = new Entity()
mirrorSelectorGlow.addComponent(resources.models.waterPuzzle.mirrorSelectorGlow)
mirrorSelectorGlow.addComponent(new Transform())
mirrorSelectorGlow.getComponent(Transform).scale.setAll(0)
engine.addEntity(mirrorSelectorGlow)

const MIRROR_MAX_DISTANCE = 3
const MIRROR_SELECTOR_HAND_Y_OFFSET = 1.5

// System that casts the rays to generate selector
class MirrorSelectorSystem implements ISystem {
  update() {
    // Ray from camera
    const rayFromCamera = PhysicsCast.instance.getRayFromCamera(MIRROR_MAX_DISTANCE)

    // For the camera ray, we cast a hit all
    PhysicsCast.instance.hitFirst(rayFromCamera, (raycastHitEntity) => {
      if (raycastHitEntity.entity.meshName == "mirrorSelector_collider") {
        let entityID = raycastHitEntity.entity.entityId
        mirrorFaceSelector(engine.entities[entityID], raycastHitEntity)
      } else {
        mirrorSelectorHand.getComponent(Transform).scale.setAll(0)
        mirrorSelectorGlow.getComponent(Transform).scale.setAll(0)
      }
    })
  }
}

// Adds systems to the engine
engine.addSystem(new MirrorSelectorSystem())

// Snaps the hand icon to discrete points on the mirror selector
function mirrorFaceSelector(entity: IEntity, raycastHitEntity: RaycastHitEntity) {
  let transform = entity.getComponent(Transform).position.clone() // Clone position of the mirror
  mirrorSelectorGlow.getComponent(Transform).position = transform.clone()
  mirrorSelectorGlow.getComponent(Transform).position.y = transform.y
  mirrorSelectorGlow.getComponent(Transform).scale.setAll(1)

  mirrorSelectorHand.getComponent(Transform).position = transform // Set selector transform to match the mirror
  mirrorSelectorHand.getComponent(Transform).position.y = transform.y + MIRROR_SELECTOR_HAND_Y_OFFSET
  mirrorSelectorHand.getComponent(Transform).scale.setAll(1)

  let mirrorSelectorRotation = mirrorSelectorHand.getComponent(Transform).rotation
  if (raycastHitEntity.hitNormal.x > 0) {
    mirrorSelectorRotation = Quaternion.Euler(0, 90, 0)
    mirrorSelectorHand.getComponent(Transform).position.x = transform.x + 1 / 1.99
  } else if (raycastHitEntity.hitNormal.x < 0) {
    mirrorSelectorRotation = Quaternion.Euler(0, -90, 0)
    mirrorSelectorHand.getComponent(Transform).position.x = transform.x - 1 / 1.99
  }
  if (raycastHitEntity.hitNormal.z > 0) {
    mirrorSelectorRotation = Quaternion.Euler(0, 0, 0)
    mirrorSelectorHand.getComponent(Transform).position.z = transform.z + 1 / 1.99
  } else if (raycastHitEntity.hitNormal.z < 0) {
    mirrorSelectorRotation = Quaternion.Euler(0, 180, 0)
    mirrorSelectorHand.getComponent(Transform).position.z = transform.z - 1 / 1.99
  }
  mirrorSelectorHand.getComponent(Transform).rotation = mirrorSelectorRotation
}
