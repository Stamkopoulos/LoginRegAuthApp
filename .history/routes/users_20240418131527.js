const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User Model
const User = require("../models/User");
const { fail } = require("assert");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

// Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields!" });
  }

  //Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords don't match" });
  }

  //Checks password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          //errors: errors, (I can do this like this)
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          //name: name, (I can do this like this, its the same thing)
          name,
          email,
          password,
        });

        //Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Set password to hashed
            newUser.password = hash;
            //Save User
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//Logout Handle
// router.get("/logout", (req, res) => {
//   req.logout();
//   req.flash("success_msg", "You are logged out");
//   res.redirect("/users/login");
// });

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      // Handle error
      console.error(err);
      //req.flash("success_msg", "You are logged out");

      return res.redirect("/users/login"); // Redirect to homepage or login page
    }
    // Redirect to homepage or login page
    req.flash("success_msg", "You are logged out");

    res.redirect("/users/login");
  });
});

module.exports = router;
