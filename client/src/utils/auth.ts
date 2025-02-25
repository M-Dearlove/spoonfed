import { JwtPayload, jwtDecode } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  username?: string;
  userId?: number;
}

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<CustomJwtPayload>(token) : null;
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  getToken(): string {
    const loggedUser = localStorage.getItem("id_token") || "";
    return loggedUser;
  }

  login(idToken: string, userName: string) {
    localStorage.setItem("id_token", idToken);
    localStorage.setItem("username", userName);
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("username");
    window.location.assign("/");
  }

  getUserId() {
    const profile = this.getProfile();
    return profile?.userId;
  }

  getUsername() {
    return localStorage.getItem("username");
  }
}

export default new AuthService();