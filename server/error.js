class CustomError extends Error {
	constructor(message, status) {
		super(message)
		this.status = status
		this.name = this.constructor.name
	}
}

module.exports = CustomError
