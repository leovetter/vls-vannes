import { StationStatus } from "./station-status.interface";

export interface StationsStatus {
    last_updated: number;
    ttl: number;
    data: {
        stations: StationStatus[];
    }
}