const path = require('path');

//using express middleware
const express = require('express');

//public folder is used to store the static client files
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));



//app will listen on port localhost port 3000
app.listen(port, () => {
  console.log(`Server is up on ${port}...`);
});
