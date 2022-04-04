var request = require("request");


function sendSms()
{
  var options = { method: 'POST',
  url: 'https://enterprise.smsgupshup.com/GatewayAPI/rest',
  form: 
  { method: 'sendMessage',
  send_to: '7004848447',
  msg: 'This is sample test message from GupShup',
  msg_type: 'TEXT',
  userid: '2000199559',
  auth_scheme: 'PLAIN',
  password: '5B2La0ME0',
  format: 'TEXT' } };


  request(options, function (error, response, body) {
  if (error) throw new Error(error);

});
 
}


sendSms();



