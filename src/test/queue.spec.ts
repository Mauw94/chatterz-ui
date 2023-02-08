import Queue from "src/app/game-engine/engine/Utils/Queue"

describe('Queue', () => {

    let queue: Queue<number>

    beforeEach(() => {
        queue = new Queue()
    })

    it('Should enqueue item', () => {
        queue.enqueue(1)
        const size = queue.size

        expect(size).toBe(1)
    })

    it('Should return first item added when dequeueing', () => {
        queue.enqueue(5)
        queue.enqueue(3)
        queue.enqueue(1)

        const item = queue.dequeue()

        expect(item).toEqual(5)
    })

    it('Should return correct queue size', () => {
        queue.enqueue(1)
        queue.enqueue(1)
        queue.enqueue(1)

        const size = queue.size

        expect(size).toEqual(3)
    })

    it('Returns last element', () => {
        queue.enqueue(1)
        queue.enqueue(2)
        queue.enqueue(3)

        const item = queue.rear()

        expect(item).toEqual(3)
    })

    it('Returns first element', () => {
        queue.enqueue(1)
        queue.enqueue(2)
        queue.enqueue(3)

        const item = queue.front()

        expect(item).toEqual(1)
    })
})