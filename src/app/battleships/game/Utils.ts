export class Utils {
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