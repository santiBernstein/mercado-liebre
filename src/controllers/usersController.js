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
  sales(req, res) {
    Item.findAll({
      where: {
        sellerId: req.session.user.id,
      },
      include: {
        all: true,
        nested: true,
      },
    }).then((items) => res.render("users/sales", { items }));
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
  },

  cart(req, res) {
    Item.findAll({
      where: {
        userId: req.session.user.id,
        state: 1,
      },
      include: ['product'],
    }).then((items) => {
      return res.render("users/cart", { items })
    });
  },

  addToCart(req, res) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      
      Product.findByPk(req.body.productId, {
        include: ["user"],
      })
        .then((product) => {
          

          let price =
            Number(product.discount) > 0
              ? product.price - (product.price * product.discount) / 100
              : product.price;

          
          return Item.create({
            salePrice: price,
            quantity: req.body.quantity,
            subTotal: price * req.body.quantity,
            state: 1,
            userId: req.session.user.id,
            sellerId: product.user.id,
            productId: product.id,
          });
        })
        .then((item) => res.redirect("/users/cart"))
        .catch((e) => console.log(e));
    } else {
       Product.findByPk(req.body.productId, {
         include: ["user"],
       })
         .then(product => {
            return res.render('products/detail', {product, errors: errors.mapped()})
         })
    }
  },

  deleteFromCart(req, res) {
    Item.destroy({
      where: {
        id: req.body.itemId,
      },
      force: true,
    })
      .then((response) => res.redirect("/users/cart"))
      .catch((e) => console.log(e));
  },

  shop(req, res) {
    let items;

    
    Item.findAll({
      where: {
        userId: req.session.user.id,
        state: 1,
      },
    })
      
      .then((itemsSearched) => {
        items = itemsSearched;
        return Item.closeItems(req.session.user.id);
      })
     
      .then(() => {
        return Cart.findOne({
          order: [["createdAt", "DESC"]],
        });
      })
      
      .then((cart) => {
        return Cart.create({
          orderNumber: cart ? ++cart.orderNumber : 1000,
          total: items.reduce(
            (total, item) => (total = total + item.subTotal),
            0
          ),
          userId: req.session.user.id,
        });
      })
      
      .then((cart) => {
        return Item.assignItems(req.session.user.id, cart.id);
      })
     
      .then(() => res.redirect("/users/history"))
      .catch((e) => console.log(e));
  },

  history(req, res) {
    Cart.findAll({
      where: {
        userId: req.session.user.id,
      },
      include: {
        all: true,
        nested: true,
        paranoid: false,
      },
      order: [["createdAt", "DESC"]],
    })
      .then((carts) => {
        res.render("users/history", { carts });
      })
      .catch((e) => console.log(e));
  },

  showBuyDetail(req, res) {
    Cart.findByPk(req.params.id, {
      include: {
        all: true,
        nested: true,
        paranoid: false,
      },
    }).then((cart) => res.render("users/buyDetail", { cart }));
  },
};
