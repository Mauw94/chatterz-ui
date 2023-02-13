export class Utils {

    /**
     * Fit X and Y properly on the canvas as if the canvas was a grid.
     * X will be rounded to every n'th targetWidth based on the canvas size.
     * Y will be rounded to every n'th targetHeight based on the canvas size.
     * e.g. canvas width = 400, targetWidth = 20, selected xPos on canvas is 42 => 
     * X = 42 will be rounded to 40.
     * e.g. canvas height = 600, targetHeight = 30, selected yPos on canvas is 187 => 
     * Y = 187 will be rounded to 180
     * @param pos 
     * @param targetWidth 
     * @param targetHeight 
     * @returns 
     */
    public static alignXAndY(pos: [number, number], targetWidth: number, targetHeight: number): [number, number] {
        let offsetX = pos[0] % targetWidth
        let offsetY = pos[1] % targetHeight

        if (offsetX >= 10) {
            pos[0] = pos[0] + targetWidth - offsetX
        } else {
            pos[0] = pos[0] - offsetX
        }

        if (offsetY >= 10) {
            pos[1] = pos[1] + targetHeight - offsetY
        } else {
            pos[1] = pos[1] - offsetY
        }

        return [pos[0], pos[1]]
    }
}