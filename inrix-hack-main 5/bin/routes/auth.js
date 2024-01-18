const router = require('express').Router();
const AdminAuthController = require("../controllers/auth")

const { verifyToken } = require('../middlewares/authMiddleware');

//signup a realx admin
router.post('/signUp',AdminAuthController.registerUser);

//login if acc there if not then signup
router.post('/login',AdminAuthController.loginOrSignUpUser);



//route to refresh token
router.post('/refresh',AdminAuthController.refresh);

// router.use(verifyToken)
router.get('/verifyToken',AdminAuthController.verifyToken)

module.exports =  router;