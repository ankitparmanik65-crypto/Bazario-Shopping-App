import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not defined in .env');
    throw new Error('JWT_SECRET is missing');
  }

  return jwt.sign(
    { 
      id: userId,
      iat: Math.floor(Date.now() / 1000)   // Issued at (explicit)
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '90d'   
    }
  );
};

export default generateToken;