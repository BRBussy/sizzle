export default class ContactFailed extends Error {
  /**
   * the error returned when
   * contacting the server failed
   */
  public error: any;

  /**
   * the method which failed
   */
  public method: string = '';

  /**
   * construct a new Contact Failed Error Object
   */
  constructor(error: any, method: string) {
    super();
    this.method = method;
    this.error = error;
  }

  public toString() {
    return `server contact failed for method ${this.method} with error ${this.error}`;
  }
}