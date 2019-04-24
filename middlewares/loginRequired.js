/** *
 * loginRequired.js
 * This middleware file checks to see if a user is logged in.
 */

exports.loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      message: "Unauthorized User",
    });
  }
};
