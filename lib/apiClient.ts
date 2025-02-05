import api from "../api"
// Basic error interface for consistent error handling

export const apiClient = {
  // Example api client:
  //
  //   async get(id: string): Promise<any> {
  //     try {
  //       return await api.request(`/some-resource/${id}`);
  //     } catch (err) {
  //       throw this.handleError(err);
  //     }
  //   },
  //
  //   async create(data: any): Promise<any> {
  //     try {
  //       return await api.request('/some-resource', {
  //         method: 'POST',
  //         body: JSON.stringify(data)
  //       });
  //     } catch (err) {
  //       throw this.handleError(err);
  //     }
  //   },
  //

  // Utility error handler that should be used by all endpoints
  handleError(error: any): Error {
    console.error("API Error:", error)
    if (error instanceof Error) {
      return error
    }
    return new Error(`An unexpected error occurred with the API: ${error}`)
  },
}
