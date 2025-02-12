import { Request, Response, NextFunction } from 'express';
import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    return jwtDecode(this.getToken())
  }
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
  isTokenExpired(token: string): boolean {
    try {
      const decodeToken = jwtDecode<JwtPayload>(token);
      if (decodeToken.exp && decodeToken.exp < Date.now() / 1000) {
        return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  }
  getToken(): string {
    const loggedUser = localStorage.getItem('id_token') || '';
    return loggedUser;
  }
  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
  //  window.location.assign('/');
  }
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Token expired' });
    }
    // You can add the decoded user to the request object
    (req as any).user = decoded;
    next();
    ;
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Export the AuthService instance for client-side use
export const authService = new AuthService();
