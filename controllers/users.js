const User = require("../models/user");

module.exports.renderSignupForm =  (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res) =>{
    try{

    let {username, email, password} = req.body;
   const newUser =  new User({email,username});
  const registeredUser = await User.register(newUser, password);

  


  req.login(registeredUser, (err) =>{

    if (err) {
      return  next(err);
        
    }

    req.flash("success", "Welcome to Wanderlust");
    res.redirect("/listings");
  } );
  
  
      }catch(err){
         req.flash("error", err.message);
         res.redirect("/signup");
      }
  
  
  };

  module.exports.renderLignForm = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.login =  async(req, res) =>{
    req.flash("success","welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    
    res.redirect(redirectUrl);
    
    };

    module.exports.logOut = (req,res, next) =>{
        req.logOut((err) =>{
          if (err) {
            return  next(err);
              
          }
          req.flash("success", "you are logged out!");
          res.redirect("/listings");
        })  
      };