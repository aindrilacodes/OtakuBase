class ApiResponse {
  constructor(data, message) {
    (this.data = data), (this.success = true), (this.message = message);
  }
}
export default ApiResponse ;
