// This is important! It ensures that this file acts as a module augmentation
// and doesn't overwrite the original Express types.
import "express-serve-static-core";

// This merges with the original Request type and adds our custom property
declare module "express-serve-static-core" {
  interface Request {
    userId: string;
    userEmail: string;
  }
}
