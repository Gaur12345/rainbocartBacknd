const conn = require("../../Database/DatabaseConn");
var sha1 = require('sha1');



exports.sellerCheckEmail= (req,res) =>
{
    let sql = `select uEmail from userregistration where uEmail=?`;
    conn.databaseConn.query(sql,[req.body.sellerEmail],function(error,result){

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


exports.sellerForgotPassword = (req,res)=>
{

    let encPass = sha1(req.body.password);
    let sql = "update  userregistration set uPassword=? where uEmail=? ";
    conn.databaseConn.query(sql,[
      encPass,
      req.body.emailID],function (err,result){
     
      if(err)
      {
        res.send(err)
      }
      else
      {
          if(result.affectedRows == 1)
          {
              res.send("ChnageSuccessfully") ;
              
          }
      }
  })
  
}
exports.editSellerProfileInformation = (req,res)=>
{
    let sql = `update userregistration set ${req.body.filedName}='${req.body.editFiled}' 
    where uEmail='${req.body.emailID}' `;

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