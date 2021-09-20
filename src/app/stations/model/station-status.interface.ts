export interface StationStatus {
    station_id: string;
    num_bikes_available: number
    num_bikes_disabled: number
    num_docks_available: number
    is_installed: number
    is_renting: number
    is_returning: number
    last_reported: number
}