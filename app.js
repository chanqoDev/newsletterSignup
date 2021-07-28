// install require modules
const express = require('express');
const request = require('request');
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();

// in our homepage use our home directory to add our static folder named public where we have all of our files.
app.use("/", express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}))
// app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

mailchimp.setConfig({
  apiKey: "698fdc88780fc15ba0a282fd3dddd519-us6",
  server: "us6"
});

app.post('/', function(req, res) {
const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email

const listId = "be709b4e62";
const subscribingUser = {
  firstName: firstName,
  lastName: lastName,
  email: email,
}
// upload data to the server
async function run() {
   const response = await mailchimp.lists.addListMember(listId, {
     email_address: subscribingUser.email,
     status: "subscribed",
     merge_fields: {
         FNAME: subscribingUser.firstName,
         LNAME: subscribingUser.lastName
     }
   });
   //If all goes well logging the contact's id
 res.sendFile(__dirname + "/success.html")
 console.log(
`Successfully added contact as an audience member. The contacts id is ${response.id}.`);
}
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

// after the failure then we get sent out..
app.post('/failure', (req, res) => {
  res.redirect('/');
})



// local host port3000 but using heroku makes it dynamic
app.listen(process.env.PORT || 3000, ()=> {
  console.log('Server is running on port 3000');
});


// api Key :  698fdc88780fc15ba0a282fd3dddd519-us6
// list iD : be709b4e62
