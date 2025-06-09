class SessionService {
  createSession(data) {
    sessionStorage.setItem("wannapop_session", JSON.stringify(data));
  }

  getSessionData() {
    const session = sessionStorage.getItem("wannapop_session");
    return session ? JSON.parse(session) : null;
  }

  destroySession() {
    sessionStorage.removeItem("wannapop_session");
  }

  isAuthenticated() {
    return !!this.getSessionData();
  }
}

const sessionService = new SessionService();
export default sessionService;