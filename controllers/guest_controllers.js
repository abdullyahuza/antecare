
//Guest model
const Guest = require('../models/guests');

// new guest controller
const new_guest = (req, res) => {
  //initialize new guest
  let uid = parseInt(Math.random() * 1000);
  uid = uid>99 ? uid='0'+uid : uid>9 ? uid='00'+uid : uid = '000'+uid
  let firstname = req.body.firstname.trim()
  let lastname = req.body.lastname.trim()

  let fInitial = firstname.charAt(0).toUpperCase()
  let lInitial = lastname.charAt(0).toUpperCase()

  let pid = fInitial+lInitial+uid

  const newGuest = new Guest({
    pid: pid,
    firstName: firstname,
    lastName: lastname
  });

  newGuest.save()
    .then(function(newGuestData){
      req.flash('newGuestSuccessMsg', `${newGuestData.pid}`)
      res.redirect('/')
    })
    .catch(function(err){console.log(err)});
}

//allow user 
const log_guest = (req, res) => {
  let guestPid;
  if(req.method === "GET"){
    guestPid = req.params.pid
  }else{
    guestPid = req.body.pid
  }

  Guest.findOne({pid: guestPid})
  .then(function(guest){
    if(guest){
      // console.log(guest)
      res.render('guest/chat', {title: 'AnteCare', guest: guest, layout:'chat-layout.hbs'});  
    }
    else{
      req.flash('loginError', `Invalid PID`)
      res.render('index',{title: 'AnteCare', logError: req.flash('loginError')});  
    } 
  })
  .catch(function(error){console.log(error)})
}

const chat = (req, res) => {
  res.render('chat')
}


module.exports = {
  new_guest,
  log_guest,
}