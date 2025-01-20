const jwt = require("jsonwebtoken");

// Middleware function to authenticate token
function authenticateToken(req, res, next) {
  // Extract the Authorization header
  const authHeader = req.headers["authorization"]; 
  // Extract the token from the header (Bearer <token>)
  const token = authHeader && authHeader.split(" ")[1]; 

  // If no token is provided, respond with 401 (Unauthorized)
  if (!token) {
    console.log("Token missing"); // Debugging log
    return res.sendStatus(401); 
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err); // Debugging log
      return res.sendStatus(401); 
    }
    // Attach the verified user information to the request object
    req.user = user; 
    // Call the next middleware or route handler
    next(); 
  });
}

module.exports = {
  authenticateToken,
};
