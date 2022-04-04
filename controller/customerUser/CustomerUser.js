const conn = require("../../Database/DatabaseConn");
var sha1 = require('sha1');
var multer = require('multer');
var path = require('path');
let fs = require('fs');
const app = require('express')()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
app.use(bodyParser.json())
var geolocation = require("geolocation")
//app.use(app.static('public'));
app.use(fileUpload());
const jwt = require('jsonwebtoken');
var { encryptData, decryptData } = require('../utils/Utils');



exports.customerRegistration = (req, res) => {

  const key = "password";
  const password = decryptData(req.body.password, key);
  const name = decryptData(req.body.name, key);
  const emailID = decryptData(req.body.email, key);
  const mobileNumber = decryptData(req.body.mobileNumber, key);
  const gender = decryptData(req.body.gender, key);
  const address = decryptData(req.body.address, key);
  const landmark = decryptData(req.body.landmark, key);
  const city = decryptData(req.body.city, key);
  const stateIs = decryptData(req.body.stateIs, key);
  const pinCode = decryptData(req.body.pinCode, key);
  const country = decryptData(req.body.country, key);

  let encPass = sha1(password);
  let sql = `insert into customersignup (cName,cEmail,cPassword,cMobile,cGender,cAddress,cLandmark,cCity,cState,cPincode,cCountry) values 
  (?,?,?,?,?,?,?,?,?,?,?)`;

  conn.databaseConn.query(sql,
    [
      name,
      emailID,
      encPass,
      mobileNumber,
      gender,
      address,
      landmark,
      city,
      stateIs,
      pinCode,
      country,

    ], function (error, data) {

      if (error) {

        res.send(error)
      }
      else {
        if (data.affectedRows === 1) {
          res.send("customerregister")
        }
      }

    })

}


// For Customer Login 



exports.customerLogin=(req,res)=>
{
    const key = "password";
    let decipher1 = decryptData(req.body.email, key);
    let decipher2 = decryptData(req.body.password, key);
    let encPass = sha1(decipher2);
    sql = "select cid,cEmail,cMobile from customersignup where cPassword=? AND (cMobile=? OR cEmail=?)";

    conn.databaseConn.query(sql,[encPass,decipher1,decipher1],function(err,data){
     
        if(err)
        {
            res.send(err);
        }
        else
        {
            if(data.length == 1)
            {
              var token = jwt.sign({ 
                id: data[0].cid,
                cEmail: data[0].cEmail }, "jwtScrate", {
                expiresIn: 86400 // 24 hours
              });
            
              res.json({
                loginStatus : "loginSuccessfully",
                userInformation : encryptData(JSON.stringify(data), key),
                token : token
              })
             
            }
            else
            {
                let resData = encryptData(JSON.stringify(["","invalid Login"]), key);
                res.json({
                  loginStatus : "NotLoggedin",
                  resData: resData
                })
            }
            
        }
    })
}


exports.searchShop = (req, res) => {
  let sql = `select uid,uname,uShopName,uMobile,uEmail,uShopCategory,uAddress,uArea,uCity,
  uState,uCountry,uPinCode,uShopImagePath,uDescription  
   from userregistration 
     where uArea=? OR uCity=? OR uState=? OR uCountry=? OR uPinCode=?`;
  const key = "password";
  let decipher1 = decryptData(req.body.shopName, key);
  conn.databaseConn.query(sql, [
    decipher1,
    decipher1,
    decipher1,
    decipher1,
    decipher1
  ], function (error, result) {

    if (error) {
      res.send(error)
    }
    else {
      if (result.length > 0) {
        let resData = encryptData(JSON.stringify(result), key);
        res.send(resData);
      }
      else {
        res.send([]);
      }
    }
  })

}


exports.showAllShopProduct = (req, res) => {
  const key = "password";
  let decipher1 = decryptData(req.body.productTable, key);
  let sql = `select * from ${decipher1}`;

  conn.databaseConn.query(sql, function (error, data) {

    if (error) {
      res.send(error)
    }
    else {
      if (data.length > 0) {
        // let resData = encryptData(JSON.stringify(data), key);
        res.send(data);
      }
      else {
        res.send([]);
      }
    }
  })


}
//imageTable : imageTable
exports.showAllShopProductImage = (req, res) => {
  // const key = "password";
  // let decipher1 = decryptData(req.body.imageTable, key);
  let sql = `SELECT imgPath FROM ${req.body.imageTable} WHERE proID = ${req.body.proID}`;

  conn.databaseConn.query(sql,function (error, data) {
    
    if (error) {
      res.send(error)
    }
    else {
      if (data.length > 0) {
        
        res.send(data);
      }
      else {
        res.send(data);
      }
    }
  })


}


exports.addTOCart = (req, res) => {

  const key = "password";
  let customerID = decryptData(req.body.customerID, key);
  //let productTable = decryptData(req.body.productTable, key);
  //let productID = decryptData(req.body.productID, key);
  //let productQuantity = decryptData(req.body.productQuantity, key);
  //let shopRegNum = decryptData(req.body.shopRegNum, key);
  let sql = "SELECT DISTINCT(productTable) FROM `addtocart` WHERE customerID=?";

  conn.databaseConn.query(sql, [customerID], function (error, result) {

    if (error) {
      res.send(error)
    }
    else {
      
      if (result.length <= 5) {
        
        let key = 'password';
        const cId = decryptData(req.body.customerID, key);
        let sql2 = `insert into addtocart (customerID,productTable,productID,quantity,shopRegID) values 
        (?,?,?,?,?)`;

        conn.databaseConn.query(sql2,

          [cId,
            req.body.productTable,
            req.body.productID,
            req.body.productQuantity,
            req.body.shopRegNo], function (error2, result2) {

              if (error2) {
                res.send(error2)
              }
              else {
                if (result2.affectedRows == 1) {
                  res.send("productAddedToCard");
                }
              }

            })

      }
      else {
        res.send("productNotAdded")
      }
    }
  })


}




// Function for addToCart 

funAcceptProductTable = (proTable, cusID) => {

  let arr = [];
  for (let i = 0; i < proTable.length; i++) {
    let sql = `select * from addtocart where productTable='${proTable[i].productTable}' and customerID=? `;
    conn.databaseConn.query(sql, [cusID], function (error2, result2) {

      if (error2) {
        return error2
      }
      else {
        arr.push(result2);

        if (i == proTable.length - 1) {
         
          return arr;
        }
      }

    })

  }

}


// Shop Cart Item 
exports.showCartItem = (req, res) => {

  let k = 0;
  let arr = [];
  let proTableArray = [];
  let flag = 0;
  // let sql = `SELECT DISTINCT(productTable) FROM addtocart WHERE customerID=?` ;
  let sql = `SELECT * FROM addtocart WHERE customerID=?`;

  conn.databaseConn.query(sql, [req.body.customerID], function (error, result) {
    
    if (error) {
      
      res.send(error)
    }
    else {
  
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          //let sql2 = `select * from ${result[i].productTable} where proID=?`;
          let sql2 = `SELECT pro.* , reg.* from ${result[i].productTable} pro INNER join userregistration reg on pro.shopRegID = reg.uid  
               where pro.proID=?`;

          conn.databaseConn.query(sql2, [result[i].productID], function (err2, data) {
            let cartID = { cartID: result[i].cid };
          
            if (data.length > 0) {
              data[0]['cid']= result[i].cid;
              data[0]['quantity']=result[i].quantity;
              data[0]['productTable'] = result[i].productTable;
              arr.push(...data) 
            }
            k++;
            if (k == result.length) {

              res.send(arr);
            }
          })

        }
      }
      else{
        res.send([]);
      }


    }

  })

}


// Remove From cart
exports.removeFormCart = (req, res) => {
  let sql = "delete from addtocart where cid=?";

  conn.databaseConn.query(sql, [req.body.rCid], function (error, data) {

    if (error) {
      res.send(error);
    }
    else {
      res.send("removeSuccssfully");
    }

  })
}


exports.customerAddress = (req, res) => {
  let sql = `select delA.*,cus.cName from deliveryaddress delA 
    inner join customersignup cus on  delA.customerID=cus.cid  WHERE delA.customerID=?`;

  conn.databaseConn.query(sql, [req.body.customerID], function (error, data) {

    if (error) {
      res.send(error);
    }
    else {
      if (data.length == 1) {
        res.send(data);
      }
      else {
        res.send(data);
      }
    }


  })
}


exports.addDeliveryAddress = (req, res) => {
  let sql = `insert into deliveryaddress (name,locality,landmark,city,state,country,pincode,mobile,altmobile,customerID) 
    values (?,?,?,?,?,?,?,?,?,?)`;

  conn.databaseConn.query(sql, [
    req.body.name,
    req.body.locality,
    req.body.landmark,
    req.body.city,
    req.body.stateIs,
    req.body.country,
    req.body.pinCode,
    req.body.mobileNumber,
    req.body.altMobile,
    req.body.customerID,
  ], function (error, result) {

    if (error) {
      res.send(error)
    }
    else {
      if (result.affectedRows === 1) {
        res.send("addressAddress")
      }
    }

  })
}

exports.customerEmailCheck = (req, res) => {
  const key = "password";
  let decipher1 = decryptData(req.body.customerEmail, key);
  let sql = `select cEmail from customersignup where cEmail=?`;
  conn.databaseConn.query(sql, [decipher1], function (error, result) {

    if (error) {
      res.send(error);
    }
    else {
      if (result.length == 1) {
        let resData = encryptData(JSON.stringify(result), key);
        res.send(resData);
      }
      else {
        res.send("error")
      }
    }
  })
}


exports.forgotCustomerPassword = (req, res) => {
  const key = "password";
  // let decipher1 = decryptData(req.body.emailID, key);
  // let password = decryptData(req.body.password, key);
  let encPass = sha1(req.body.password);
 
  let sql = "update  customersignup set cPassword=? where cEmail=? ";
  conn.databaseConn.query(sql, [
    encPass,
    req.body.emailID], function (err, result) {
      if (err) {
        res.send(err)
      }
      else {
        if (result.affectedRows == 1) {  
          res.send("ChnageSuccessfully");
        }
        else{
          res.send("PasswordNotChanged");
        }
      }
    })

}


exports.incrementDecrementItem = (req, res) => {

  let sql = `update addtocart set quantity=${req.body.quantity} where cid=${req.body.cid}`;

  conn.databaseConn.query(sql, function (error, result) {
    
    if (error) {
      res.send(error);
    }
    else {
      if (result.affectedRows == 1) {
  
        res.send("updateItems")

      }
    }
  })
}
exports.incrementDecrementItembuynow = (req, res) => {

  let sql = `update addtocart set quantity=${req.body.quantity} where customerID=${req.body.cid} AND productID= ${req.body.proID}`;

  conn.databaseConn.query(sql, function (error, result) {
    
    if (error) {
      res.send(error);
    }
    else {
      if (result.affectedRows >= 0) {
      
        res.send("updateItems")

      }
    }
  })
}

//edit delivery address
exports.editDeliveryAddress = (req, res) => {
  let sql = "update deliveryaddress set name=?,locality=?,landmark=?,city=?,state=?,pincode=?,mobile=?,altmobile=? where delID=? and customerID=?";
  conn.databaseConn.query(sql, [
    req.body.name,
    req.body.locality,
    req.body.landmark,
    req.body.city,
    req.body.state,
    req.body.pincode,
    req.body.mobile,
    req.body.altMobile,
    req.body.deliveryAddID,
    req.body.customerID,

  ], function (error, result) {

    if (error) {
      res.send(error);
    }
    else {
      if (result.affectedRows == 1) {
        res.send("updateSuccessfully")
      }
    }
  })
}

