var express = require('express');
var router = express.Router();
const productHelpers=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-helpers');
const adminHelpers = require('../helpers/admin-helpers');

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',verifyLogin, async function (req, res, next) {
  const user = req.session.user
  let products=[{
    name:'i phone',
    category:'mobile',
    description:"this is moble",
    image:'https://img.freepik.com/premium-photo/smartphone-balancing-with-pink-background_23-2150271746.jpg',
  },
{
  name:'i phone',
  category:'mobile',
  description:"this is moble",
  image:'https://img.freepik.com/premium-photo/smartphone-balancing-with-pink-background_23-2150271746.jpg',
},{
  name:'i phone',
  category:'mobile',
  description:"this is moble",
  image:'https://img.freepik.com/premium-photo/smartphone-balancing-with-pink-background_23-2150271746.jpg',
},
{
  name:'i phone',
  category:'mobile',
  description:"this is moble",
  image:'https://img.freepik.com/premium-photo/smartphone-balancing-with-pink-background_23-2150271746.jpg',
}

]
  
 
    res.render('user/view-products', { title: 'E-commerce', user ,products})


});
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    // If the user is already logged in, redirect to the home page (or any other page)
    res.redirect('/');
  } else {
    // Render the login page if the user is not logged in
    res.render('user/login', { 'loginErr': req.session.loginErr });
    
    // Clear the login error after rendering the page
    req.session.loginErr = null; 
  }
});

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelpers.dosignup(req.body).then((responce)=>{
    console.log(responce);
    res.redirect("/")
  })

})

router.post('/login', (req, res) => {
  userHelpers.dologin(req.body).then((response) => {
    if (response.status) {
        // session cookie add cheyuuka

      //respond varunna user data save chyth vechknath
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = 'Invalid Email or Password'
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy() //destroy session if logout clicked
  res.redirect('/')

})
router.get('/cart',verifyLogin,(req,res)=>{
  res.render('user/cart')
})

module.exports = router;
