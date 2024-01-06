const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already taken", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    delete user.password;

    req.session.user = {
      id: user.id,
      username: user.username,
    };

  return res.redirect('/');
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }

    delete user.password;

    req.session.user = {
      id: user.id,
      username: user.username,
    };

  return res.redirect('/');
  } catch (err) {
    next(err);
  }
};
