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


exports.getTotalCustomer = (req, res) => {
    let table = req.body.productTable.toString();
    let sql = "SELECT count(*) as totalCustomer FROM `customersignup` WHERE cid in (SELECT DISTINCT(customerID) from ordermoredeatils WHERE productTableName=?)";
    conn.databaseConn.query(sql, [
        table
    ], function (error, result) {
        if (error) {
            res.send(error)
        }
        else {
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.send([]);
            }
        }
    })

}
exports.getTotalCustomerInfo = (req, res) => {
    let table = req.body.productTable.toString();
    let sql = "SELECT cid,cName,cEmail,cMobile,cGender,cAddress,cCity,cState,cPincode,cCountry FROM `customersignup` WHERE cid in (SELECT DISTINCT(customerID) from ordermoredeatils WHERE productTableName=?)";
    conn.databaseConn.query(sql, [
        table
    ], function (error, result) {
        if (error) {
            res.send(error)
        }
        else {
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.send([]);
            }
        }
    })

}

exports.totalNewOrder = (req, res) => {   
    let sql = `select count(*) as totalOrder from ordermoredeatils 
    where productTableName=? and orderStatus='0' `;

    conn.databaseConn.query(sql, [
        req.body.productTable
    ], function (error, result) {


        if (error) {
            res.send(error);
        }
        else {
            if (result.length > 0) {

                res.send(result);
            }
            else {
                res.send("notFount")
            }
        }
    })
}




exports.viewNewOrdeAll = (req, res) => {
    // let sql = `select cusInfo.cName ,cusInfo.cMobile , delAdd.* , orderAdd.proPrice from customersignup cusInfo inner join customerorder orderAdd on cusInfo.cid = orderAdd.customerID INNER join deliveryaddress delAdd on orderAdd.dileveryAddId= delAdd.delID WHERE orderAdd.productTableName=?`;

    let sql = `select cusInfo.cName ,cusInfo.cMobile , delAdd.* ,orderAdd.paymentType,orderAdd.orderID, sum(orderAdd.proPrice * orderAdd.quantity) totalAmount,orderAdd.regDate from customersignup cusInfo 
    inner join ordermoredeatils orderAdd on cusInfo.cid = orderAdd.customerID INNER 
    join deliveryaddress delAdd on orderAdd.dileveryAddId= delAdd.delID 
    WHERE orderAdd.productTableName=?  and orderAdd.orderStatus='0' GROUP by (orderAdd.orderID) order by orderAdd.regDate DESC`;

    conn.databaseConn.query(sql, [
        req.body.productTable
    ], function (error, result) {


        if (error) {
            res.send(error);
        }
        else {
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.send([])
            }
        }
    })
}



// New Order Details 

async function  getNewOrderDetails(data, productTable){
    let arr = [];
    for(let i =0 ;i<data.length;i++){
       arr.push(data[i].productID);
    }
    return new Promise((resolve,reject)=>{
        let sql2 = `select * from ${productTable} where proID in (?)`;
        conn.databaseConn.query(sql2,[arr], function (error, result) {
            if(error){
                return reject(error);
            }
            else{
                return resolve(result);
            }
        })
    })
}

exports.newOrderDetails = async (req, res) => {
    let resArray = [];
    let sql = `select productID,orderID,quantity from ordermoredeatils where customerID=? and orderID=? and orderStatus='0' `;

    conn.databaseConn.query(sql, [req.body.customerID, req.body.orderID],async function (error, result) {

        if (error) {
            res.send(error)
        }
        else {
            if (result.length > 0) {
                let responseData = await getNewOrderDetails(result, req.body.productTable);
                if(responseData.length> 0){
                    for(let i=0;i<responseData.length;i++){
                        console.log(responseData[i])
                        responseData[i]['orderID'] = result[i].orderID;
                        responseData[i]['quantity'] = result[i].quantity;
                    }
                    resArray.push(...responseData);
                    res.send(resArray)
                }
            }
            else {
                res.send(resArray)
            }
        }
    })

}

// getCustomerAddress

exports.getCustomerAddress = (req, res) => {
    let sql = `select * from deliveryaddress where delID=?`;

    conn.databaseConn.query(sql, [req.body.delAddress], function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            res.send(data)
        }


    })
}

// getCustomerDetails

exports.getCustomerDetails = (req, res) => {
    let sql = `select * from customersignup where cid =?`;

    conn.databaseConn.query(sql, [req.body.customerID], function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            res.send(data)
        }


    })
}

///

exports.getCustomerInfoAddress = (req, res) => {
    let sql = `select cusInfo.cName,cusInfo.cMobile,delA.* from customersignup 
    cusInfo inner Join deliveryaddress delA on cusInfo.cid=delA.customerID 
    where cusInfo.cid=? and delA.delID=?`;


    conn.databaseConn.query(sql, [

        req.body.customerID,
        req.body.dileveryID
    ], function (error, result) {

        if (error) {
            res.send(error)
        }
        else {
            res.send(result);

        }
    })
}

// getShopDetails

exports.getShopDetails = (req, res) => {
    let sql = `select uname,uShopName,uGstNo,uAddress,uArea,uCity,uState,uCountry,uPinCode from userregistration 
    where uid=?`;


    conn.databaseConn.query(sql, [

        req.body.userID
    ], function (error, result) {

        if (error) {
            res.send(error)
        }
        else {
            res.send(result);

        }
    })
}

exports.confirmOrder = (req, res) => {
    let sql = `update ordermoredeatils set orderStatus=? 
    where customerID=? and orderID=?`;

    conn.databaseConn.query(sql, [
        "1",
        req.body.customerID,
        req.body.orderID
    ], function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            res.send("orderConfirm");
        }
    })
}

// storeInvoice function call 

exports.storeInvoice = (req, res) => {


    let proID = req.body.productsId.split(",")

    for (let i = 0; i < proID.length; i++) {
        let sql = `insert into ${req.body.invoiceTable} (customerID,delAddId,productID,invoiceNo,orderID) values 
          (?,?,?,?,?) `;

        conn.databaseConn.query(sql,
            [
                req.body.customerID,
                req.body.delAddressID,
                proID[i],
                req.body.invoiceNumber,
                req.body.orderID

            ], function (error, result) {

                if (error) {
                    res.send(error)
                }
                else {
                    if (i == proID.length - 1) {
                        res.send("invoiceCreated");
                    }
                }
            })


    }

    // let sql = `insert into ${req.body.invoiceTable} (customerID,delAddId,productID,invoiceID) values 
    // (?,?,?,?) `;

    // conn.databaseConn.query(sql,[

    // ],function(error,result){

    //     if(error)
    //     {
    //         res.send(error)
    //     }
    //     else
    //     {
    //         res.send("invoiceCreated");
    //     }
    // })

}

exports.updatesellerinventory = (req, res) => {
    let sendData = "";
    let sql = `UPDATE ${req.body.productTable} SET pQuantity= pQuantity-? WHERE proID=?`;
  
    for (let i = 0; i < req.body.data.length; i++) {
   
        conn.databaseConn.query(sql, [req.body.data[i].quantity,
        req.body.data[i].proID], function (error, data) {

            if (error) {
       
                sendData = error;
            }
            else {
         
                if (i == req.body.data.length - 1) {

                    sendData = "SellerDatabaseUpdated";
               
                    res.send(sendData);
                }
            }
        })
        // if(i==req.body.data.length-1 && sendData=="SellerDatabaseUpdated"){
   

    }
}
exports.viewHistoryOrderAll = (req, res) => {
    // let sql = `select cusInfo.cName ,cusInfo.cMobile , delAdd.* , orderAdd.proPrice from customersignup cusInfo inner join customerorder orderAdd on cusInfo.cid = orderAdd.customerID INNER join deliveryaddress delAdd on orderAdd.dileveryAddId= delAdd.delID WHERE orderAdd.productTableName=?`;

    let sql = `select cusInfo.cName ,cusInfo.cMobile , delAdd.* ,orderAdd.paymentType,orderAdd.orderID, sum(orderAdd.proPrice) totalAmount from customersignup cusInfo 
    inner join ordermoredeatils orderAdd on cusInfo.cid = orderAdd.customerID INNER 
    join deliveryaddress delAdd on orderAdd.dileveryAddId= delAdd.delID 
    WHERE orderAdd.productTableName=?  and orderAdd.orderStatus='1' GROUP by (orderAdd.orderID) ORDER by orderAdd.regDate DESC` ;

    conn.databaseConn.query(sql, [
        req.body.productTable
    ], function (error, result) {


        if (error) {
            res.send(error);
        }
        else {
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.send([])
            }
        }
    })
}
exports.ReturnOrderInfo = (req, res) => {
    // let sql = `select cusInfo.cName ,cusInfo.cMobile , delAdd.* , orderAdd.proPrice from customersignup cusInfo inner join customerorder orderAdd on cusInfo.cid = orderAdd.customerID INNER join deliveryaddress delAdd on orderAdd.dileveryAddId= delAdd.delID WHERE orderAdd.productTableName=?`;

    let sql = `select cusInfo.cName ,cusInfo.cMobile , delAdd.* ,orderAdd.paymentType,orderAdd.orderID, sum(orderAdd.proPrice) totalAmount from customersignup cusInfo 
    inner join ordermoredeatils orderAdd on cusInfo.cid = orderAdd.customerID INNER 
    join deliveryaddress delAdd on orderAdd.dileveryAddId= delAdd.delID 
    WHERE orderAdd.productTableName=?  and orderAdd.orderStatus='2'  GROUP by (orderAdd.orderID) ORDER by orderAdd.regDate DESC` ;

    conn.databaseConn.query(sql, [
        req.body.productTable
    ], function (error, result) {


        if (error) {
            res.send(error);

        }
        else {
            if (result.length > 0) {

                res.send(result);
            }
            else {

                res.send([])
            }
        }
    })
}
exports.HistoryOrderDetails = (req, res) => {

    let resArray = [];

    let sql = `select productID,orderID,quantity from ordermoredeatils where customerID=? and orderID=? and orderStatus='1' || orderStatus='2' `;

    conn.databaseConn.query(sql, [req.body.customerID, req.body.orderID], function (error, result) {

        if (error) {
            res.send(error)
        }
        else {
            console.log(result)
            if (result.length > 0) {

                let sql2 = `select * from ${req.body.productTable} where proID=?`;
                for (let i = 0; i < result.length; i++) {
                    conn.databaseConn.query(sql2, [result[i].productID], function (error2, result2) {
               
                        if (result2.length > 0) {
                            result2[0]['orderID'] = result[i].orderID;
                            result2[0]['quantity'] = result[i].quantity;
                            resArray.push(...result2);

                            
                        }
                        if (i == result.length - 1) {
                            res.send(resArray)
                        }
                    })
                }
            }
            else {
                res.send(resArray)
            }

        }


    })

}
exports.getTotalCustomer = (req, res) => {
    let sql = "SELECT count(*) as totalCustomer FROM `customersignup` WHERE cid in (SELECT DISTINCT(customerID) from ordermoredeatils WHERE productTableName=?)";
    conn.databaseConn.query(sql, [
        req.body.productTable
    ], function (error, result) {
        if (error) {
            res.send(error)
        }
        else {
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.send([]);
            }
        }
    })

}
