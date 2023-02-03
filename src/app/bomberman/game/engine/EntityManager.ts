import Entity from "./Entity";

class EntityManager {

    private entities: Entity[] = []

    public addEntity(entity: Entity) {
        if (!entity.hasBeenSetup) {
            entity.setup()
        }
        this.entities.push(entity)
    }

    public getEntities(): Entity[] {
        return this.entities
    }

    public removeEntity(entity: Entity) {
        this.entities = this.entities.filter(e => e.id !== entity.id)
    }
}

export default EntityManager