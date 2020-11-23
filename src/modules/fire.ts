import resources from "../resources"

const smallFirePositions: Vector3[] = [
  new Vector3(4.5, 4.3, 8.5),
  new Vector3(15, 4.3, 11.58),
  new Vector3(4.5, 4.3, 43.5),
  new Vector3(13, 4.55, 26.16),
  new Vector3(13, 4.55, 42.99),
  new Vector3(38.5, 4.3, 42.5),
  new Vector3(43.5, 4.3, 36.5),
  new Vector3(42.55, 4.3, 24.86),
  new Vector3(32.57, 4.3, 19.55),
  new Vector3(32.57, 4.3, 11.3),
  new Vector3(43.5, 4.3, 8.48),
  new Vector3(16.98, 12.15, 19.25),
  new Vector3(30.72, 12.15, 19.25),
  new Vector3(40.48, 17, 42.51),
  new Vector3(40.48, 17, 36.5),
  new Vector3(15.99, 2.25, 45.86),
  new Vector3(32.03, 2.25, 45.86),
]
const largeFirePositions: Vector3[] = [
  new Vector3(18.04, 13.2, 10.35),
  new Vector3(29.88, 13.2, 10.35),
  new Vector3(17.99, 11.3, 45.85),
  new Vector3(30.03, 11.3, 45.85),
]

for (let i = 0; i < smallFirePositions.length; i++) {
  const fire = new Entity()
  fire.addComponent(resources.models.standard.fire)
  fire.addComponent(new Transform({ position: smallFirePositions[i] }))
  engine.addEntity(fire)
}

for (let i = 0; i < largeFirePositions.length; i++) {
  const fire = new Entity()
  fire.addComponent(resources.models.standard.fire)
  fire.addComponent(new Transform({ position: largeFirePositions[i], scale: new Vector3(2, 2, 2) }))
  engine.addEntity(fire)
}
