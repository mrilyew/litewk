class ApiError extends Error {
    constructor(message, code) {
        super(message)
        this.name = 'ApiError'
        this.code = code
    }
}
