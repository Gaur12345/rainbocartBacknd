var crypto = require('crypto-js');
const jwt = require('jsonwebtoken');

function encryptData(props,key)
{
    let cipher=crypto.AES.encrypt(props,key).toString();
    //console.log(cipher);
       return cipher;
}



function decryptData(props,key)
{
    let cipher=crypto.AES.decrypt(props,key).toString(crypto.enc.Utf8); 
   // console.log(cipher);      
    return cipher;
}


// send mail function 


exports.sendMail = (req, res) => {
    let render = "";
    
    if (req.body.type === "Customer") {
      render = jade.compileFile('F:/localShop/backend/controller/customerUser/html.jade');
    }
    if (req.body.type === "Seller") {
      render = jade.compileFile('F:/localShop/backend/controller/shopDetails/html.jade');
    }
    if (req.body.type === "Delivery") {
      render = jade.compileFile('F:/localShop/backend/controller/DeliveryBoy/html.jade');
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
      to: req.body.customerEmailid,
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
function verifyTokenForCustomer (req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, "jwtScrate", (err, decoded) => {
    if (err) {
      // console.log("error")
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
function verifyTokenForSeller (req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, "jwtSeller", (err, decoded) => {
    if (err) {
      // console.log("error")
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
module.exports = {

    encryptData : encryptData,
    decryptData : decryptData,
    verifyTokenForCustomer :verifyTokenForCustomer,
    verifyTokenForSeller :verifyTokenForSeller
}