export class NetworkingError {
  constructor(message, statusCode = null) {
    this.message = message;
    this.statusCode = statusCode;
  }
}