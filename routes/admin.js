var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers')
const adminHelpers = require('../helpers/admin-helpers');
const { response } = require('../app');


const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/admin/admin-login')
  }
}

/* GET users listing. */
router.get('/', verifyLogin, function (req, res, next) {
  const admin = req.session.admin
  // productHelpers.getAllProducts().then((products) => {
    res.render('admin/admin-home', { title: 'admin panel', admin })
    console.log(admin)
  // })

});

router.get('/admin-signin', (req, res) => {
  if(req.session.loggedIn){
    res.redirect("admin/admin-home")
  }else{

  
  res.render('admin/sign-in', { admin: true, hideHeader: true, })
  }
})

router.post('/admin-signin', (req, res) => {
  console.log(req.body)

  adminHelpers.doAdminSignin(req.body).then((response)=>{
    
    // req.session.loggedIn = true
    // req.session.admin = response.admin
    res.redirect('/admin/admin-login')
  })
})

router.get('/admin-login', (req, res) => {
  const admin = req.session.admin
  if (req.session.loggedIn) {
    res.redirect('/admin/admin-login')
  } else {
    res.render('admin/admin-login', { loginErr: req.session.loginErr, hideHeader: true, })
    req.session.loginErr = false
  }
})

router.post('/admin-login', (req, res) => {
  console.log(req.session)
  adminHelpers.doAdminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.admin = response.admin
      console.log(req.session);
      res.redirect('/admin')
    } else {
      req.session.loginErr = 'invalid email or password'
      res.redirect('/admin/admin-login')
    }
  })
})

router.get('/admin-logout', (req, res) => {
  req.session.destroy()
  res.redirect('/admin/admin-login')
})

router.get('/view-users', verifyLogin, async (req, res) => {
  let search = req.query.search || ''; // Get search query from URL
  let userData;

  if (search) {
    userData = await adminHelpers.getUsersByName(search);
  } else {
    userData = await adminHelpers.getAllUsers();
  }

  res.render('admin/view-users', { admin: req.session.admin, userData });
});

router.get('/add-user',verifyLogin,(req,res)=>{

  res.render('admin/add-user')

})
router.post("/add-user",(req,res)=>{
  adminHelpers.addUser(req.body).then((response)=>{
    res.redirect('/admin/view-users')
  })
})
router.get('/remove-user/:id', verifyLogin, (req, res) => {
  let userId = req.params.id;
  adminHelpers.deleteUser(userId).then(() => {
    res.redirect('/admin/view-users');
  })
});

router.get('/edit-user/:id', verifyLogin, async (req, res) => {
  let userData = await adminHelpers.getUserDetails(req.params.id)
  res.render('admin/edit-user', { admin: req.session.admin, userData })
})
router.post('/edit-user/:id', verifyLogin, (req, res) => {
  const id = req.params.id
  adminHelpers.updateUser(id, req.body).then(() => {
    res.redirect('/admin/view-users');
  })
})


module.exports = router;
