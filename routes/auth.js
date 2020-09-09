const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');

//for frontend testing purpose
router.post('/login', function(req, res, next) {

  // db.selectByEmail(req.body.id, (err, user) => {
  //   if (err) return res.status(500).send('Error on the server.');
  //   if (!user) return res.status(404).send('No user found.');
  //   let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
  //   if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
  //   let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
  //   });
  //   res.status(200).send({ auth: true, token: token, user: user });
  // });
  let id = req.body.id,
    password = req.body.password;

  if( id !== 'test' )return res.status(404).send('No user found.' + id);
  if( password !== 'passwd') return res.status(401).send({ auth: false, token: null });
  let token = jwt.sign({ id: id }, password, { expiresIn: 86400 // expires in 24 hours
      });
  res.status(200).send({ auth: true, token: token, id: id });
});

module.exports = router
