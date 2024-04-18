const { RiEdit2Fill } = require("react-icons/ri");

module.exports = {
  ensureAuthenicated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view this resource");
    res.redirect("/users/login");
  },
};
