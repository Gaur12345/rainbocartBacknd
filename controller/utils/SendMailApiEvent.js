// send mail function 
let handlebars = require('handlebars');
let fs = require('fs');
let path = require('path');
let nodemailer = require('nodemailer');
let jade = require('jade');

var {encryptData, decryptData} = require('./../utils/Utils');

exports.sendClientMail = (req, res) => {
   let  render="";
  // var template = process.cwd() + '/controller/utils/OTPMail.jade';
  // console.log(req.body.otp)
  //  render   = jade.renderFile(template, {otp:Number(req.body.otp)});
  // render = jade.renderFile(render);
  // const html = jade.renderFile(template, OTP);
  const filePath = path.join(__dirname, '/OTPMail.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    otp:req.body.otp.toString()
  };
  const htmlToSend = template(replacements);
  var emailFrom = 'kishor.gnnxtech@gmail.com';  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kishor.gnnxtech@gmail.com',
      pass: 'Kissu@2214'
    }
  });
  var options = {
    from: emailFrom,
    to: req.body.sellerEmail,
    subject: 'OTP Rainbow Cart',
    html: htmlToSend

  };
  transporter.sendMail(options, function (error, info) {
    if (error) {
      return false;
    }
    else {
      res.send("EmailsendSuccessfully");
      return true;

    };
  });
}

exports.sendMail = (req, res) => {
  const key = "password";
    let render = "";
    if (req.body.type === "Customer") {
      var template = process.cwd() + '/controller/utils/Customer.jade';
      render = jade.compileFile(template);   
    }
    if (req.body.type === "Seller") {
      var template = process.cwd() + '/controller/utils/Seller.jade';
      render = jade.compileFile(template);
    }
    if (req.body.type === "Delivery") {
      var template = process.cwd() + '/controller/utils/Delivery.jade';
      render = jade.compileFile(template);
    }
    const html = render(render);
  
    var emailFrom = 'kishor.gnnxtech@gmail.com';  
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kishor.gnnxtech@gmail.com',
        pass: 'Kissu@2214'
      }
    });
    var options = {
      from: emailFrom,
      to: decryptData(req.body.customerEmailid, key),
      subject: 'Forget Password Rainbow Cart',
      html: html,
  
    };
    transporter.sendMail(options, function (error, info) {
      if (error) {
        return false;
      }
      else {
        res.send("EmailsendSuccessfully");
        return true;
      };
    });
  }