var express = require('express');
var router = express.Router();
var Controller = require('../controller')

// Repo
router.get('/repo', Controller.listStarred)
router.post('/repo/filter', Controller.listStarredFilter)
router.get('/repo/searchByName/:name/:owner', Controller.searchByName)
router.post('/repo', Controller.create)
router.get('/repo/:username', Controller.listByUsername)
router.get('/repo/star/:owner/:repo', Controller.star)
router.get('/repo/unstar/:owner/:repo', Controller.unstar)

// User
router.post('/user/login', Controller.checkLogin)
router.post('/user/checklocalstorage', Controller.checkLocalStorage)

module.exports = router