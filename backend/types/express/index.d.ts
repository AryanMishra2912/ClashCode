// Extends Express's Request type so req.user is recognised by TypeScript
// without needing a cast everywhere.
declare namespace Express {
  interface Request {
    user?: {
      userId: number;
      role: string;
      [key: string]: unknown;
    };
  }
}
