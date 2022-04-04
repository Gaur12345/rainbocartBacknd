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
var { encryptData, decryptData } = require('../utils/Utils');



exports.MyOrders = (req,res)=>
{
    let sql = `SELECT orderID,sum(proPrice * quantity) as proPrice ,paymentType,dileveryAddId,deliveryDate,orderStatus,regDate,count(orderID) as items from ordermoredeatils WHERE customerID=? GROUP by orderID ORDER BY regDate DESC`;

    conn.databaseConn.query(sql,[req.body.customerID],function(error,result){

        if(error)
        {
            res.send(error);
        }
        else
        {
            res.send(result)
        }
    })

}

exports.removeProductFromCart = (req,res)=>
{
    let sql = `DELETE FROM addtocart WHERE customerID = ?`;

    conn.databaseConn.query(sql,[req.body.customerID],function(error,result){

        if(error)
        {
            res.send(error);
        }
        else
        {
            res.send('true')
        }
    })

}
exports.orderMoreDetails = (req,res)=>{
    let sql = "SELECT productID,productTableName,quantity from ordermoredeatils WHERE customerID=? and orderID=?";
    
    conn.databaseConn.query(sql,[
        req.body.customerID,
        req.body.orderID
    ],function(error,result){

        if(error)
        {
            res.send(result)
        }
        else
        {
            let responseData = [];
            for(let i=0;i<result.length;i++)
            {
                let sql2 = `select pCompanyName,productName,pCategory,pColor,pSize,pPrice,pDescription,imagePath,shopRegID from 
                ${result[i].productTableName} where proID=${result[i].productID}`;

                conn.databaseConn.query(sql2,function(error2,result2){

                    if(error2)
                    {
                        res.send(error2);
                    }
                    else
                    {
                        // result[0]["orderId"]=result[i].orderID;
                        // result2[0]["deliveryDate"]=result[i].deliveryDate;
                        // result2[0]["paymentType"]=result[i].paymentType;
                        // result2[0]["deleveryAddress"] = result[i].dileveryAddId;
                         result2[0]["quantity"]=result[i].quantity;
                        responseData.push(...result2);
                    }

                    if(i == result.length -1 )
                    {
                        res.send(responseData)
                    }

                })

            }
        }
    })
}
exports.getSellerDetails = (req,res)=>{
    let sql  = `select uname,uMobile,uEmail,uGender,uShopName,uGstNo,uAddress,uArea,uCity,uState,uCountry,uPinCode from userregistration 
    where uid =?`;

    conn.databaseConn.query(sql,[req.body.sellerID],function(error,result){

        if(error)
        {
            res.send(error)
        }
        else
        {
            if(result.length == 1)
            {
                res.send(result);
            }
            else
            {
                res.send([])
            }
        }
    })
}


exports.getShippingDetails = (req,res) =>
{
    const key = "password";
    
    let sql  = `select locality,landmark,city,state,country,pincode,mobile,altmobile from deliveryaddress 
    where delID=?`;

    conn.databaseConn.query(sql,[req.body.delAddressID],function(error,result){

        if(error)
        {
            res.send(error)
        }
        else
        {
            if(result.length == 1)
            {
                let resData = encryptData(JSON.stringify(result), key);
              res.send(resData);
            }
            else
            {
                res.send([])
            }
        }
    })
}


exports.getCustomerInformation = (req,res)=>{
    let key = 'password';
    let sql = `select * from customersignup where cid=?`;
    let Cid = decryptData(req.body.customerID,key);
    conn.databaseConn.query(sql,[
        Cid

    ],function(error,result){

        if(error)
        {
            res.send(error)
        }
        else
        {
            if(result.length == 1)
            {
                let resData = encryptData(JSON.stringify(result), key);
                res.send(resData);
            }
            else
            {
                let resData = encryptData(JSON.stringify(result), key);
                res.send(resData);
            }
        }

    })

}



exports.editSaveInformation = (req,res)=>
{
    let sql = `update customersignup set ${req.body.filedName}='${req.body.editFiled}' 
    where cid='${req.body.customerID}' `;

    conn.databaseConn.query(sql,function(error,result){

        if(error)
        {
            res.send(error);
        }
        else
        {
            if(result.affectedRows == 1)
            {
                res.send("updateSuccess")
            }

        }
    })
}
exports.cancelOrder = (req,res)=>
{   //let orderStatus =2;
    let sql = `UPDATE customerorder SET orderStatus = '2' WHERE customerorder.orderID  = ?`;

    conn.databaseConn.query(sql,[req.body.user],function(error,result){

        if(error)
        {
            res.send(error);
        }
        else
        {
            if(result.affectedRows == 1)
            {
                res.send("updateSuccess")
            }

        }
    })
}