
const express = require('express');

const appController = require('../controllers/app_controller');

const router = express.Router();


//index route
router.get('/', appController.app_index);

// //login route
// router.get('/chat', function(req, res){
// 	res.render('chat', {layout: 'chat-layout.hbs'});
// });

router.post('/antecare/api/reply', appController.bot_reply);

router.post('/antecare/api/save', appController.bot_save);

router.post('/antecare/api/ai', appController.ai_reply);

module.exports = router;
