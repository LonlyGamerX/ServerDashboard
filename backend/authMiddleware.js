// authMiddleware.js
const requireLogin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: Please log in first" });
  }
};

module.exports = requireLogin;
