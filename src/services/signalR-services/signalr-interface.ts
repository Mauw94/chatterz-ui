export interface SignalRService {
    connect(): Promise<void>
    disconnect(): Promise<void>
}