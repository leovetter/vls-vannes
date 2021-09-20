export class IncompleteApiError extends Error {
    
    constructor(message: string) {
        super(message);
        this.name = 'IncompleteApiError';
    }
}