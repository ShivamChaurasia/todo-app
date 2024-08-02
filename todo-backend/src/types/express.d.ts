import { AppUser } from '../user/app-user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
    }
  }
}
