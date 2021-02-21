const bycrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");



const {
  User,
  Product,
  Token,
  Cart,
  Item,
  sequelize,
} = require("../database/models");

module.exports = {
  
  index(req, res) {
    User.findAll()
      .then((users) => res.render("users/users", { users }))
      .catch((e) => console.log(e));
  },


  profile(req, res) {
    User.findByPk(req.session.user.id, {
      include: ["sales", "products"],
    }).then((user) => res.render("users/profile", { user }));
  },

 
  create(req, res) {
    return res.render("users/user-register-form");
  },
    
  store(req, res) {
    const errors = validationResult(req);
   

    if (errors.isEmpty()) {
      const _body = req.body;
      delete _body.retype;
      _body.password = bycrypt.hashSync(_body.password, 10);
      _body.admin = 0;
      _body.image = req.file ? req.file.filename : null;

      User.create(_body)
        .then((user) => res.redirect("/users/login/"))
        .catch((e) => console.log(e));
    } else {
      return res.render("users/user-register-form", {
        errors: errors.mapped(),
        old: req.body,
      });
    }
  },
  
  showLogin(req, res) {
    return res.render("users/user-login-form");
  },

  processLogin(req, res) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      User.findOne({
        where: {
          email: req.body.email,
        },
      })
        .then((user) => {
          
          let _user = { ...user.dataValues };
          req.session.user = _user;

          
          if (req.body.remember) {
            
            const token = crypto.randomBytes(64).toString("base64");
            
            res.cookie("userToken", token, {
              maxAge: 1000 * 60 * 60 * 24 * 90,
            });
            
            Token.create({
              token,
              userId: user.id,
            })
              .then((response) => res.redirect("/"))
              .catch((e) => console.log(e));
          } else {
            return res.redirect("/");
          }
        })
        .catch((e) => console.log(e));
    } else {
      return res.render("users/user-login-form", {
        errors: errors.mapped(),
        old: req.body,
      });
    }
  },

  logout(req, res) {
    
    Item.destroy({
      where: {
        userId: req.session.user.id,
        state: 1,
      },
    })
      .then(() => {
        
        req.session.destroy();

        
        if (req.cookies.userToken) {
          return Token.findOne({
            where: {
              token: req.cookies.userToken,
            },
          })
            .then((token) => {
              if (token) {
                Token.destroy({
                  where: {
                    id: token.id,
                  },
                  force: true,
                })
                  .then((token) => {
                    res.clearCookie("userToken");
                    return res.redirect("/");
                  })
                  .catch((e) => console.log(e));
              }
            })
            .catch((e) => console.log(e));
        } else {
          return res.redirect("/");
        }
      })
      .catch((e) => console.log(e));
  },

 
  edit(req, res) {
    const user = User.findByPk(req.params.id);

    return res.render("user-edit-form", { user });
  },
 
  update(req, res) {
    User.update(req.body, {
      id: req.req.params.id,
    })
      .then((user) => res.redirect("/user/profile/" + req.params.id))
      .catch((e) => console.log(e));
  },

  
  destroy(req, res) {
    User.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((user) => res.redirect("/"))
      .catch((e) => console.log(e));
  } 

  
};
