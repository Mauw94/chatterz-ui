import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { Const } from "src/utils/const";
import { SignalRService } from "./signalr-interface";

@Injectable({ providedIn: 'root' })
export class NotificationService implements SignalRService {

    private hubConnection: signalR.HubConnection
    private connectionUrl = Const.getBaseUrl() + "signalr_notification"

    public async connect() {
        await this.startConnection()
        await this.addListeners()
    }

    public async disconnect() {
        await this.hubConnection.stop()
            .then(() => {
                console.log("notification hub connection stopped")
            })
            .catch((err) => console.error(err))
    }

    private async startConnection(): Promise<void> {
        this.hubConnection = this.getConnection()

        await this.hubConnection.start()
            .then(() => {
                console.log("notification hub connection started")

            })
            .catch((err) => console.error(err))
    }

    private getConnection() {
        return new signalR.HubConnectionBuilder()
            .withUrl(this.connectionUrl)
            .build()
    }

    private async addListeners(): Promise<void> {
        this.hubConnection.on("notification", (message: string) => {
            console.log(message)
        })
    }
}