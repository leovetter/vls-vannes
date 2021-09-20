export class AppStation {
    id: string;
    name: string;
    lat: number;
    lon: number;
    capacity: number;
    num_bikes_available: number;
    num_bikes_disabled: number;
    num_docks_available: number;
    is_installed: number;
    is_renting: number;
    is_returning: number;
    last_reported: number;

    constructor(id: string, name: string, lat: number, lon: number, capacity: number, 
                num_bikes_available: number, num_bikes_disabled: number, num_docks_available: number,
                is_installed: number, is_renting: number, is_returning: number, last_reported: number) {

        this.id = id;
        this. name =  name;
        this.lat = lat;
        this.lon = lon;
        this.capacity = capacity;
        this.num_bikes_available = num_bikes_available;
        this.num_bikes_disabled = num_bikes_disabled;
        this.num_docks_available = num_docks_available;
        this.is_installed = is_installed;
        this.is_renting = is_renting;
        this.is_returning = is_returning;
        this.last_reported = last_reported;
    }
}