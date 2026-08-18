import firebaseAdminInstance from '../../config/firebase.js';

/**
 * Authentication Middleware using Firebase Admin SDK.
 * SOLID Principle: SRP - Sole responsibility is validating the user's Auth token.
 */
export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized: No token provided.' 
    });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Ensure the Firebase Singleton is initialized
    firebaseAdminInstance.initialize();

    // Verify token validity
    const decodedToken = await firebaseAdminInstance.auth.verifyIdToken(token);
    
    // Attach user identifiers to the request context
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };

    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error.message);
    return res.status(403).json({ 
      error: 'Unauthorized: Invalid or expired token.' 
    });
  }
};
