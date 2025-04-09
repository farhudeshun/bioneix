const checkRole = () => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    return next();
  };
};

module.exports = checkRole;
