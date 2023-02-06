import Entity from "./Entity";

class EntityManager {

    private entities: Entity[] = []
    private enemies: Entity[] = []
    private players: Entity[] = []
    private objects: Entity[] = []
    private bullets: Entity[] = []
    private enemyBullets: Entity[] = []

    public getEntities(): Entity[] {
        return this.entities
    }

    public removeEntity(entity: Entity) {
        this.entities = this.getEntities().filter(e => e.id !== entity.id)
    }

    public addBullet(bullet: Entity) {
        if (!bullet.hasBeenSetup) {
            bullet.setup()
        }
        this.bullets.push(bullet)
        this.entities.push(bullet)
    }

    public getBullets(): Entity[] {
        return this.bullets
    }

    public removeBullet(entity: Entity) {
        this.bullets = this.bullets.filter(b => b.id !== entity.id)
        this.removeEntity(entity)
    }

    public addEnemyBullet(entity: Entity) {
        if (!entity.hasBeenSetup) {
            entity.setup()
        }
        this.enemyBullets.push(entity)
    }

    public getEnemyBullets(): Entity[] {
        return this.enemyBullets;
    }

    public removeEnemyBullet(entity: Entity) {
        this.enemyBullets = this.enemyBullets.filter(x => x.id !== entity.id)
    }

    public addEnemy(enemy: Entity) {
        if (!enemy.hasBeenSetup) {
            enemy.setup()
        }
        this.enemies.push(enemy)
        this.entities.push(enemy)
    }

    public getEnemies(): Entity[] {
        return this.enemies
    }

    public removeEnemy(entity: Entity) {
        this.enemies = this.enemies.filter(e => e.id !== entity.id)
        this.removeEntity(entity)
    }

    public addPlayer(entity: Entity) {
        if (!entity.hasBeenSetup) {
            entity.setup()
        }
        this.players.push(entity)
        this.entities.push(entity)
    }

    public getPlayers(): Entity[] {
        return this.players
    }

    public removePlayer(entity: Entity) {
        this.players = this.players.filter(p => p.id !== entity.id)
        this.removeEntity(entity)
    }

    public addObject(entity: Entity) {
        if (!entity.hasBeenSetup) {
            entity.setup()
        }
        this.objects.push(entity)
        this.entities.push(entity)
    }

    public getObjects(): Entity[] {
        return this.objects
    }

    public removeObject(entity: Entity) {
        this.objects = this.objects.filter(o => o.id !== entity.id)
        this.removeEntity(entity)
    }

    public checkEnemies() {
        if (this.enemies.length === 0) {
            console.log("trigger round won screen")
        }
    }

    public clear(): void {
        this.entities = []
        this.players = []
        this.enemies = []
        this.bullets = []
        this.objects = []
    }

    public clearBullets(): void {
        this.bullets = []
    }
}

export default EntityManager