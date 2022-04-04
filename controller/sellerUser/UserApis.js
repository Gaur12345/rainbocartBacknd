const conn = require("../../Database/DatabaseConn");
var sha1 = require('sha1');
var multer = require('multer');

var path = require('path');
let fs = require('fs');
const app = require('express')()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
app.use(bodyParser.json())
//app.use(app.static('public'));
app.use(fileUpload());
var { encryptData, decryptData } = require('../utils/Utils');

require('dotenv/config')
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
AWS.config.update({ region: 'ap-south-1' });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY2,
    secretAccessKey: process.env.AWS_SECRET_KEY2,
    // region : process.env.AWS_BUCKET_REGION
})

async function insertDataSignup(req) {

    let encPass = sha1(req.body.password);
    let sql = "insert into userregistration  (uFormverification,uname,uMobile,uEmail,uGender,uShopName,uShopCategory,uGstNo,uAddress,uCity,uState,uCountry,uPinCode,uPassword,uShopImagePath,uDescription,termCondition) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    return new Promise((resolve,reject)=>{
        conn.databaseConn.query(sql,[
            0,
            '',
            '',
            req.body.emailID,
            '',
            req.body.shopName,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            encPass,
            "",
            '',
            req.body.termCondition,
             ], async function (err, result, fields) {
                 if(err)
                 {
                     return reject(err);
                 }
                 else
                 {
                     return resolve(result);
                 }});

    });  
}

async function uploadSellerShopImage(req,insertIndex)
{
    return new Promise((resolve,reject)=>{
          const params = {
            Bucket: "sellershopimagebucket",
            Key: `sellerimage${insertIndex}.jpg`,
            Body: req.files.shopImage.data
        }   
        
            s3.upload(params, (error, data) => {
                if(error){
                   return reject(error)
                }
                else
                {
                  return resolve(data)
                }
            })
    })
}

async function updateSellerShopImage(imagePath,shopId)
{
    return new Promise((resolve,reject)=>{
        let sql = "update userregistration set uShopImagePath=? where uid=?";
        conn.databaseConn.query(sql,[imagePath,shopId],
            async function (error,result) {
                if(error){
                    return reject(error)
                 }
                 else
                 {
                   return resolve(result)
                 }
            })
    })
    
}

async function createProductTableForSeller(req,id) {
    let proTable = id+"productTable";
    return new Promise((resolve,reject)=>{
        let qur = `create table IF NOT EXISTS ${proTable}(

            proID INT(7) AUTO_INCREMENT PRIMARY KEY,
            pCompanyName varchar(150),
            productName  varchar(100),
            pCategory    varchar(20),
            pColor       varchar(40),
            pSize        varchar(15),
            pQuantity    varchar(7),
            pMrp         varchar(9),
            pPrice       varchar(9),
            offer        int(3),
            pDescription varchar(255),
            imagePath    varchar(255),
            shopRegID    int(10)
         )`;

         conn.databaseConn.query(qur,function(error,result){    
             if(error)
             {
                 return reject(error)
             }       
             else
             {
                 return resolve(result);
             }   
         })
    })
}

async function createImageTableForSeller(req,id) {
    let imgPathTable = id+"imagepathTable";
    return new Promise((resolve,reject)=>{
        let qur = `create table IF NOT EXISTS ${imgPathTable}(

            imgID INT(7) AUTO_INCREMENT PRIMARY KEY,
            imgPath varchar(255),
            proID  int(7)
         )`;
         conn.databaseConn.query(qur,function(error,result){    
             if(error)
             {
                 return reject(error)
             }       
             else
             {
                 return resolve(result);
             }   
         })
    })
    
}
exports.completeUserRegistration = (req,res)=>{
    sql = "UPDATE `userregistration` SET `uFormverification`=?,`uname`=?,`uMobile`=?,`uGender`=?,`uShopCategory`=?,`uGstNo`=?,`uAddress`=?,`uArea`= ?,`uCity`=?,`uState`=?,`uCountry`=?,`uPinCode`=?,`uShopImagePath`=?,`uDescription`= ? WHERE uEmail = ?"
    conn.databaseConn.query(sql, [
        1,
        req.body.name,
        req.body.mobile,
        req.body.gender,
        req.body.shopcategory,
        req.body.gstno,
        req.body.address,
        req.body.landmark,
        req.body.city,
        req.body.state,
        req.body.country,
        req.body.pincode,
        req.body.imagedata,
        req.body.shopdescription,
        req.body.emailID
        ],
         function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Inserted Successfully");

        }
    })
}
exports.fetchdataseller = (req,res)=>{
    sql = "SELECT * FROM `userregistration` WHERE uid = ?"
    conn.databaseConn.query(sql, [req.body.uid], function (err, data) {
        data[0].uPassword = sha1(data[0].uPassword)
       

        if (err) {
            res.send(err);
        }
        else {
                res.send(data)


        }
    })
}
exports.formVerification = (req,res)=>{
    sql = "SELECT uFormVerification FROM `userregistration` WHERE uEmail = ?"
    conn.databaseConn.query(sql, [req.body.email], function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
                res.send(data)


        }
    })
}
exports.userRegistration = async (req,res)=>{

        var bucketPolicy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "AddPerm",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": ""
                }
            ]
        }

        try{
            const result  = await insertDataSignup(req);
            if(result.affectedRows == 1 )
            {
                // const sellerShopImage = await uploadSellerShopImage(req,result.insertId);
                // const updateSellerShopImg = await updateSellerShopImage(sellerShopImage.Location,result.insertId)
                // const result2 = await createProductTableForSeller(req,result.insertId);
                // const result3 = await createImageTableForSeller(req,result.insertId);
                let bucketName = result.insertId+"rainbowcartbucket";
                const params = {
                    Bucket : bucketName
                  }
                const bucketObj = await s3.createBucket(params).promise();
                
                if(bucketObj.Location !=null && bucketObj.Location.length > 5)
                {
                    var bucketResource = "arn:aws:s3:::" + params.Bucket + "/*";
                    bucketPolicy.Statement[0].Resource = bucketResource;
                
                    let bucketPolicyParams = {Bucket: params.Bucket, Policy: JSON.stringify(bucketPolicy)};
                    // set the new policy on the selected bucket
                    s3.putBucketPolicy(bucketPolicyParams, function(err, data) {
                        if (err)
                        {
                            res.send(err)
                        } 
                        else
                        {
                           res.send("Inserted Successfully");
                        }
                    });
                    
                }
                else
                {
                    res.send(bucketObj)
                }
            }

        }
        catch(error)
        {
            res.send(error)
        }
}
exports.verifyEmail = (req, res) => {

    const key = "password";
    // let decipher1 = decryptData(req.body.email, key);
    sql = "SELECT * FROM `userregistration` WHERE uEmail = ?"
    conn.databaseConn.query(sql, [req.body.email], function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
                res.send(data)


        }
    })
}


exports.userLogin = (req, res) => {

    const key = "password";
    let decipher1 = decryptData(req.body.email, key);
    let decipher2 = decryptData(req.body.password, key);
    let encPass = sha1(decipher2);

    sql = "select uid,uEmail,uMobile from userregistration where uPassword=? AND (uMobile=? OR uEmail=?)";

    conn.databaseConn.query(sql, [encPass, decipher1, decipher1], function (err, data) {

        if (err) {
            res.send(err);
        }
        else {
            if(data.length == 1)
            {
              var token = jwt.sign({ 
                id: data[0].cid,
                cEmail: data[0].cEmail }, "jwtSeller", {
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
                res.send(resData)
            }

        }
    })
}


exports.allData = (req, res) => {

    let sql = "select * from userregistration where uMobile=?";

    conn.databaseConn.query(sql, [req.body.mobileNo], function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            if (data.length == 1) {
                res.send(data);
            }
        }
    });

}



exports.ShowAllCompany = (req, res) => {
    let sql = "select companyName from company";

    conn.databaseConn.query(sql, function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            res.send(data);
        }


    })
}


exports.addComPro = (req, res) => {


    let sql = "insert into company (companyName) values (?)";

    conn.databaseConn.query(sql, [req.body.companyName], function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            if (data.affectedRows == 1) {
                res.send("CompanyProductAdded");
            }
        }



    })
}

exports.allRegProduct = (req, res) => {
    let sql = "select productName from products";

    conn.databaseConn.query(sql, function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            res.send(data);
        }

    })

}


// exports.allRegProduct = (req,res)=>
// {
//     let sql = "select productName from products";

//     conn.databaseConn.query(sql,function(error,data){

//         if(error)
//         {
//             res.send(error);
//         }
//         else
//         {
//             res.send(data);
//         }

//     })

// }


exports.addNewProduct = (req, res) => {


    let sql = "insert into products (productName) values (?)";

    conn.databaseConn.query(sql, [req.body.productName], function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            if (data.affectedRows == 1) {
                res.send("ProductAdded");
            }
        }



    })
}


exports.allRegColors = (req, res) => {
    let sql = "select colorName from colors";

    conn.databaseConn.query(sql, function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            res.send(data);
        }

    })

}



exports.AddColor = (req, res) => {


    let sql = "insert into colors (colorName) values (?)";

    conn.databaseConn.query(sql, [req.body.colorName], function (error, data) {

        if (error) {
            res.send(error);
        }
        else {
            if (data.affectedRows == 1) {
                res.send("ColorAdded");
            }
        }

    })
}


exports.addProductStock = (req, res) => {


    let mobile = req.body.mobileNo;
    let email = req.body.emailID;

    let folder = email.split("@");


    let folDir = folder[0] + "folder" + mobile;

    let filename = path.join(__dirname, "../../../");

    let fpath = path.join(filename, `rainbowcart/public/ProductFiles/${folDir}`);


    let myFile1 = null;
    let newName1 = "";
    let storePath1 = "";
    let myFile2 = null;
    let newName2 = "";
    let storePath2 = "";
    let myFile3 = null;
    let newName3 = "";
    let storePath3 = "";
    let myFile4 = null;
    let newName4 = "";
    let storePath4 = "";


    if (req.body.noOfImage == 1) {
        
        let insertedID = 0;

        let proTable = req.body.shopID + "producttable";

        let sql = `insert into ${proTable} 
                (pCompanyName,productName,pColor,pCategory,pSize,pQuantity,pMrp,pPrice,offer,pDescription,imagePath,shopRegID) 
                values (?,?,?,?,?,?,?,?,?,?,?,?)`;


        conn.databaseConn.query(sql,
            [
                req.body.companyName,
                req.body.productName,
                req.body.categorySet,
                req.body.colorSet,
                req.body.sizeName,
                req.body.quantity,
                req.body.mrp,
                req.body.price,
                req.body.offer,
                req.body.description,
                storePath1,
                req.body.shopID
            ], function (error, data) {


                if (error) {
                    res.send(error);
                }
                else {
                    insertedID = data.insertId;
                    
                    const params = {
                        Bucket: `${req.body.shopID}rainbowcartbucket`,
                        Key: `${req.body.companyName}${req.body.productName}1.jpg`,
                        Body: req.files.imageData0.data
                    }

                    s3.upload(params, (error, data) => {
                        if (error) {
                            res.status(500).send(error)
                        }
                        else {
                            let imgPathTable = req.body.shopID + "imagepathtable";


                            let qur = `insert into ${imgPathTable} 
                            (imgPath,proID) values (?,?)`;

                            conn.databaseConn.query(qur,
                                [data.Location,
                                    insertedID], function (er2, data2) {

                                        if (er2) {
                                            res.send(er2);
                                        }


                                    })
                            res.send("Inserted Successfully");
                        }

                    })
                }
            })
    }


    if (req.body.noOfImage == 2) {
        let insertedID = 0;

        myFile1 = req.files.imageData0;
        newName1 = `${req.body.productName}${req.body.companyName}1.jpg`;
        storePath1 = `/ProductFiles/${folDir}/${newName1}`;

        myFile2 = req.files.imageData1;
        newName2 = `${req.body.productName}${req.body.companyName}2.jpg`;
        storePath2 = `/ProductFiles/${folDir}/${newName2}`;


        let em = email.split("@");
        let proTable = em[0] + "product" + mobile;


        let sql = `insert into ${proTable} 
                (pCompanyName,productName,pColor,pCategory,pSize,pQuantity,pMrp,pPrice,pDescription,imagePath,shopRegID) 
                values (?,?,?,?,?,?,?,?,?,?,?)`;


        conn.databaseConn.query(sql,
            [
                req.body.companyName,
                req.body.productName,
                req.body.categorySet,
                req.body.colorSet,
                req.body.sizeName,
                req.body.quantity,
                req.body.mrp,
                req.body.price,
                req.body.description,
                storePath1,
                req.body.shopID

            ], function (error, data) {


                if (error) {
                    res.send(error);
                }
                else {
                    insertedID = data.insertId;
                    myFile1.mv(`${fpath}/${newName1}`, function (err) {

                        if (err) {
                          
                            return res.status(500).send({ msg: "Error occured" });
                        }
                    });

                    myFile2.mv(`${fpath}/${newName2}`, function (err) {

                        if (err) {
                           
                            return res.status(500).send({ msg: "Error occured" });
                        }
                    });
                    let newImageName = [newName1, newName2];
                    let newImageBody = [myFile1.data, myFile2.data];

                    for (let i = 0; i < 2; i++) {

                        const params = {
                            Bucket: "demorainbowcart10",
                            Key: newImageName[i],
                            Body: newImageBody[i]
                        }
                        s3.upload(params, (error, data) => {
                            if (error) {
                                res.status(500).send(error)
                            }
                            else {
                                let imgPathTable = em[0] + "imagepath" + mobile;


                                let qur = `insert into ${imgPathTable} 
                            (imgPath,proID) values (?,?)`;

                                conn.databaseConn.query(qur,
                                    [data.Location,
                                        insertedID], function (er2, data2) {

                                            if (er2) {
                                                res.send(er2);
                                            }
                                            else {

                                            }


                                        })
                            }


                        })
                        if (i === 1) {
                            res.send("Inserted Successfully");
                        }
                    }
                }
            })
    }


    if (req.body.noOfImage == 3) {
        let insertedID = 0;
        myFile1 = req.files.imageData0;
        newName1 = `${req.body.productName}${req.body.companyName}1.jpg`;
        storePath1 = `/ProductFiles/${folDir}/${newName1}`;

        myFile2 = req.files.imageData1;
        newName2 = `${req.body.productName}${req.body.companyName}2.jpg`;
        storePath2 = `/ProductFiles/${folDir}/${newName2}`;

        myFile3 = req.files.imageData2;
        newName3 = `${req.body.productName}${req.body.companyName}3.jpg`;
        storePath3 = `/ProductFiles/${folDir}/${newName3}`;

        let em = email.split("@");
        let proTable = em[0] + "product" + mobile;
        let sql = `insert into ${proTable} 
        (pCompanyName,productName,pColor,pCategory,pSize,pQuantity,pMrp,pPrice,pDescription,imagePath,shopRegID) 
        values (?,?,?,?,?,?,?,?,?,?,?)`;
        conn.databaseConn.query(sql,
            [
                req.body.companyName,
                req.body.productName,
                req.body.categorySet,
                req.body.colorSet,
                req.body.sizeName,
                req.body.quantity,
                req.body.mrp,
                req.body.price,
                req.body.description,
                storePath1,
                req.body.shopID
            ], function (error, data) {


                if (error) {
                    res.send(error);
                }
                else {
                    insertedID = data.insertId;
                    myFile1.mv(`${fpath}/${newName1}`, function (err) {

                        if (err) {
                          
                            return res.status(500).send({ msg: "Error occured" });
                        }


                    });
                    myFile2.mv(`${fpath}/${newName2}`, function (err) {

                        if (err) {
                          
                            return res.status(500).send({ msg: "Error occured" });
                        }


                    });
                    myFile3.mv(`${fpath}/${newName3}`, function (err) {

                        if (err) {
                          
                            return res.status(500).send({ msg: "Error occured" });
                        }


                    });
                    let newImageName = [newName1, newName2,newName3];
                    let newImageBody = [myFile1.data, myFile2.data,myFile3.data];

                    for (let i = 0; i < 3; i++) {

                        const params = {
                            Bucket: "demorainbowcart10",
                            Key: newImageName[i],
                            Body: newImageBody[i]
                        }
                        s3.upload(params, (error, data) => {
                            if (error) {
                                res.status(500).send(error)
                            }
                            else {
                                let imgPathTable = em[0] + "imagepath" + mobile;


                                let qur = `insert into ${imgPathTable} 
                            (imgPath,proID) values (?,?)`;

                                conn.databaseConn.query(qur,
                                    [data.Location,
                                        insertedID], function (er2, data2) {

                                            if (er2) {
                                                res.send(er2);
                                            }
                                            else {

                                            }
                                        })
                            }
                        })
                        if (i === 1) {
                            res.send("Inserted Successfully");
                        }
                    }
                    
                }

            })
    }



    if (req.body.noOfImage == 4) {
        let insertedID = 0;
        myFile1 = req.files.imageData0;
        newName1 = `${req.body.productName}${req.body.companyName}1.jpg`;
        storePath1 = `/ProductFiles/${folDir}/${newName1}`;

        myFile2 = req.files.imageData1;
        newName2 = `${req.body.productName}${req.body.companyName}2.jpg`;
        storePath2 = `/ProductFiles/${folDir}/${newName2}`;

        myFile3 = req.files.imageData2;
        newName3 = `${req.body.productName}${req.body.companyName}3.jpg`;
        storePath3 = `/ProductFiles/${folDir}/${newName3}`;

        myFile4 = req.files.imageData3;
        newName4 = `${req.body.productName}${req.body.companyName}4.jpg`;
        storePath4 = `/ProductFiles/${folDir}/${newName4}`;


        let em = email.split("@");

        let proTable = em[0] + "product" + mobile;

        let sql = `insert into ${proTable}
        (pCompanyName,productName,pColor,pCategory,pSize,pQuantity,pMrp,pPrice,pDescription,imagePath,shopRegID) 
        values (?,?,?,?,?,?,?,?,?,?,?)`;


        conn.databaseConn.query(sql,
            [
                req.body.companyName,
                req.body.productName,
                req.body.categorySet,
                req.body.colorSet,
                req.body.sizeName,
                req.body.quantity,
                req.body.mrp,
                req.body.price,
                req.body.description,
                storePath1,
                req.body.shopID
            ], function (error, data) {


                if (error) {
                    res.send(error);
                }
                else {
                    insertedID = data.insertId;
                    myFile1.mv(`${fpath}/${newName1}`, function (err) {

                        if (err) {
                       
                            return res.status(500).send({ msg: "Error occured" });
                        }


                    });


                    myFile2.mv(`${fpath}/${newName2}`, function (err) {

                        if (err) {
                          
                            return res.status(500).send({ msg: "Error occured" });
                        }


                    });


                    myFile3.mv(`${fpath}/${newName3}`, function (err) {

                        if (err) {
                 
                            return res.status(500).send({ msg: "Error occured" });
                        }


                    });

                    myFile4.mv(`${fpath}/${newName4}`, function (err) {

                        if (err) {
                         
                            return res.status(500).send({ msg: "Error occured" });
                        }


                    });
                    let newImageName = [newName1, newName2,newName3,newName4];
                    let newImageBody = [myFile1.data, myFile2.data,myFile3.data,myFile4.data];

                    for (let i = 0; i < 4; i++) {

                        const params = {
                            Bucket: "demorainbowcart10",
                            Key: newImageName[i],
                            Body: newImageBody[i]
                        }
                        s3.upload(params, (error, data) => {
                            if (error) {
                                res.status(500).send(error)
                            }
                            else {
                                let imgPathTable = em[0] + "imagepath" + mobile;


                                let qur = `insert into ${imgPathTable} 
                            (imgPath,proID) values (?,?)`;

                                conn.databaseConn.query(qur,
                                    [data.Location,
                                        insertedID], function (er2, data2) {

                                            if (er2) {
                                                res.send(er2);
                                            }
                                            else {

                                            }


                                        })
                            }


                        })
                        if (i === 1) {
                            res.send("Inserted Successfully");
                        }

                    }
                }

            })

    }
}


exports.showAllProduct = (req, res) => {

    

    let proTable = req.body.shopID + "producttable";

    let sql = `select * from ${proTable}`;

    conn.databaseConn.query(sql, function (err, data) {

        if (err) {
            res.send(err);
        }
        else {

            if(data.length>0){
                res.send(data)
            }
            else{
                res.send([]);
            }

        }

    })

}



exports.getProductInfo = (req, res) => {

    let shopid = req.body.shopid;
    let email = req.body.emailID;


    let proTable = shopid + "producttable";


    let sql = `select * from ${proTable} where proID=?`;

    conn.databaseConn.query(sql, [req.body.proID], function (err, data) {

        if (err) {
            res.send(err);
        }
        else {
            if (data.length > 0) {
                res.send(data)
            }


        }

    })

}


exports.deleteProduct = (req, res) => {

    let mobile = req.body.mobileNo;
    let email = req.body.emailID;

    let em = email.split("@");

    let proTable = em[0] + "product" + mobile;

    let imgTable = em[0] + "imagepath" + mobile;

    let sql = `delete from ${proTable} where proID=?`;

    conn.databaseConn.query(sql, [req.body.proID], function (err, data) {

        if (err) {
            res.send(err);
        }
        else {
            if (data.affectedRows == 1) {
                let qur = `delete from ${imgTable} where proID=?`;

                conn.databaseConn.query(qur, [req.body.proID], function (error, result) {

                    if (error) {
                        res.send(error)
                    }
                    else {
                        res.send("deleteDone");
                    }

                })
            }


        }

    })

}


exports.getProductImage = (req, res) => {

    let proTable = req.body.shopID + "imagepathtable";

    let sql = `select imgPath from ${proTable} where proID=?`;


    conn.databaseConn.query(sql, [req.body.proID], function (error, data) {

        if (error) {

        }
        else {
            res.send(data);
        }

    })

}


exports.updateProduct = (req, res) => {

    let mobile = req.body.mobileNo;
    let email = req.body.emailID;

    let em = email.split("@");

    let proTable = em[0] + "product" + mobile;

    let sql = `update ${proTable} set pCompanyName=?,
    productName=?,pCategory=?,pColor=?,pSize=?,pQuantity=?,pMrp=?,
    pPrice=?,pDescription=? where proID=?`;

    conn.databaseConn.query(sql, [

        req.body.companyName,
        req.body.productName,
        req.body.categorySet,
        req.body.colorSet,
        req.body.sizeName,
        req.body.quantity,
        req.body.mrp,
        req.body.price,
        req.body.descryption,
        req.body.proID

    ], function (error, data) {

        if (error) {

            res.send(error);
        }
        else {
            res.send("updateSuccess");
        }
    })
}


