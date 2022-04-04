const conn = require("../../Database/DatabaseConn");
var sha1 = require('sha1');
var { encryptData, decryptData } = require('../utils/Utils');

exports.deliveryBoySignUp = (req,res)=>{

  const key = "password";
  const password= decryptData(req.body.password, key);
  const name =decryptData(req.body.name, key); 
  const emailID =decryptData( req.body.email, key);
  const mobileNumber = decryptData(req.body.mobileNumber, key);
  const gender = decryptData(req.body.gender, key);
  const address = decryptData(req.body.address, key);
  const city = decryptData(req.body.city, key);
  const stateIs = decryptData(req.body.stateIs, key);
  const country = decryptData(req.body.country, key);
  const pinCode = decryptData(req.body.pinCode, key);
  const panNo = decryptData(req.body.panNo, key);
  const aadharNo = decryptData(req.body.aadharNo, key);

  let encPass = sha1(password);
    let sql = `insert into deliveryboysignup (dName,dmobile,demail,dgender,daadhaarNo,dpanNo,daddress,dcity,dstate,dcountry,dpincode,dpassword,dbankaccountno,dbankIFSCNo) values 
    (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  
    conn.databaseConn.query(sql,
      [
        name,
      emailID,
      encPass,
      mobileNumber,
      gender,
      address,
      city,
      stateIs,
      pinCode,
      country,
      aadharNo,
      panNo,
        "",
        ""
  
      ],function(error,data){
  
        if(error)
        {
         
          res.send(error)
        }
        else
        {
          if(data.affectedRows === 1)
          {
            res.send("deliveryboyRegister")
          }
        }
  
      })
}

// For Delivery Boy Login 
exports.deliveryBoyLogin=(req,res)=>
{

  const key = "password";
  let decipher1 = decryptData(req.body.email, key);
  let decipher2 = decryptData(req.body.password, key);
  let encPass = sha1(decipher2);
    
    sql = "select delbId,dName,dmobile,demail from deliveryboysignup where dpassword=? AND (dmobile=? OR demail=?)";

    conn.databaseConn.query(sql,[encPass,decipher1,decipher1],function(err,data){

        if(err)
        {
            res.send(err);
        }
        else
        {
            if(data.length == 1)
            {
                //console.log(data.length);
                data.push("loginSuccessfully")
                let resData = encryptData(JSON.stringify(data), key);
              res.send(resData);

            }
            else
            {
              let resData = encryptData(JSON.stringify(["","invalid Login"]), key);
              res.send(resData)
            }
            
        }
    })
}



exports.deliveryBoyCheckEmail= (req,res) =>
{
  const key = "password";
    let decipher1 = decryptData(req.body.deliveryBoyEmail, key);
    let sql = `select demail from deliveryboysignup where demail=?`;
    conn.databaseConn.query(sql,[decipher1],function(error,result){

      if(error)
      {
        res.send(error);
      }
      else
      {
        if(result.length == 1)
        {
            res.send(result)
        }
        else
        {
          res.send("error")
        }
      }
    })
}


exports.deliveryBoyForgetPassword = (req,res)=>
{
  let decipher1 = decryptData(req.body.emailID, key);
    let encPass = sha1(req.body.password);
    let sql = "update  deliveryboysignup set dpassword=? where demail=? ";
    conn.databaseConn.query(sql,[
      encPass,
      decipher1],function (err,result){
     
      if(err)
      {
        res.send(err)
      }
      else
      {
          if(result.affectedRows == 1)
          {
              res.send("ChnageSuccessfully");
          }
      }
  })
  
}


exports.deliveryBoyInfo = (req,res)=>
{
    let sql = `select dName,dmobile,demail,dgender,daadhaarNo,dpanNo,daddress,dcity,dstate,dcountry,dpincode,
    dbankaccountno,dbankIFSCNo from deliveryboysignup where demail=${req.body.emailID}`;
    conn.databaseConn.query(sql,function(error,result){

      if(error)
      {
          res.send(error);
      }
      else
      {
        if(res.length == 1)
        {
          res.send(result);
        }
      }
    })
}