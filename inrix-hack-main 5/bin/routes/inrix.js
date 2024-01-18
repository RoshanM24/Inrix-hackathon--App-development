const router = require('express').Router();
const InrixController = require("../controllers/inrix")


router.post('/getroute',InrixController.getRoute);

router.post('/endtrip',InrixController.endTrip);

module.exports =  router;