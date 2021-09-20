import { StationInformation } from "./station-information.interface";

export interface StationsInformation {
    last_updated: number;
    ttl: number;
    data: {
        stations: StationInformation[];
    }
}