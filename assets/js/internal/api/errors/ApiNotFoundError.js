class ApiNotFoundError extends Error {
    constructor(message, code) {
        super(message)
        this.name = 'ApiNotFoundError'
        this.code = code
    }
}
