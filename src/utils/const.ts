import { environment } from "src/environments/environment"

export class Const {
    public static getBaseUrl(): string {
        if (environment.production)
            return "https://localhost:7291/" // TODO: azure url here
        else
            return "https://localhost:7291/"
    }

}