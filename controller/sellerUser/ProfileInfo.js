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






exports.getProfileData = (req,res)=>
{
    
    let sql ="select * from userregistration where uEmail=?";

    conn.databaseConn.query(sql,[req.body.emailID],function(error,data){

        if(error)
        {
            res.send(error)
        }
        else
        {
           

            if(data.length ==  1)
            {
                res.send(data);
            }
            
        }
    })
}