class Queue<T> {

    private items: T[]

    constructor() {
        this.items = []
    }

    enqueue(item: T) {
        this.items.push(item)
    }

    dequeue(): T {
        if (this.isEmpty()) {
            console.log("Queue is empty")
            return null
        }

        return this.items.shift()
    }

    front(): T {
        if (this.isEmpty()) {
            console.log("Queue is empty")
            return null
        }

        return this.items[0]
    }

    rear(): T {
        if (this.isEmpty()) {
            console.log("Queue is empty")
            return null
        }

        return this.items[this.size - 1]
    }

    get size(): number {
        return this.items.length
    }

    isEmpty(): boolean {
        return this.items.length === 0
    }

    clear() {
        this.items = []
    }
}

export default Queue