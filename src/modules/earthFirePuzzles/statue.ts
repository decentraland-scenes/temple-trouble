export enum StatueType {
  Earth = 0,
  Fire = 1,
}

export class Statue extends Entity {
  public signGlow = new Entity()
  public statueType: StatueType

  constructor(statue: GLTFShape, signGlow: GLTFShape, transform: Transform, statueType: StatueType) {
    super()
    engine.addEntity(this)
    this.addComponent(statue)
    this.addComponent(transform)
    this.statueType = statueType

    this.signGlow.addComponent(signGlow)
    this.signGlow.addComponent(new Transform())
    this.signGlow.getComponent(Transform).scale.setAll(0)
    this.signGlow.setParent(this)
  }

  toggleGlow(isOn: boolean): void {
    if (isOn) {
      this.signGlow.getComponent(Transform).scale.setAll(1)
    } else {
      this.signGlow.getComponent(Transform).scale.setAll(0)
    }
  }
}
