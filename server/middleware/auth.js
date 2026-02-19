export const requireAuth = (req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
