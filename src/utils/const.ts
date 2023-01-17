import { environment } from "src/environments/environment"

export class Const {
    public static getBaseUrl(): string {
        if (environment.production)
            return "https://chatterz.azurewebsites.net/"
        else
            return "https://localhost:7291/"
    }

}