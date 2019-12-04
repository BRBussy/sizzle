export default class MethodFailedError extends Error {
  /**
   * the error returned from the server when
   * the method failed
   */
  public error: any;

  /**
   * the method which failed
   */
  public method: string = '';

  /**
   * construct a new method failed error object
   */
  constructor(error: any, method: string) {
    super();
    this.error = error;
    this.method = method;
  }

  public toString() {
    return `method ${this.method} failed with error ${this.error}`;
  }
}
