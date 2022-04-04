require('dotenv/config')
const AWS = require('aws-sdk')
const uuid = require('uuid/v4')
AWS.config.update({region: 'ap-south-1'});

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY2,
    secretAccessKey: process.env.AWS_SECRET_KEY2,
    // region : process.env.AWS_BUCKET_REGION
})


exports.uploadFile =  (req,res)=>
{
//   console.log(req.files)
//   console.log(req.body.name)

 // res.send("done")
  let myFile = req.files.image.name.split(".")
  const fileType = myFile[myFile.length - 1]

    const params = {
      Bucket: "demorainbowcart10",
      Key: `sdfsdf.jpg`,
      Body: req.files.image.data
  }
  
      s3.upload(params, (error, data) => {
          if(error){
              res.status(500).send(error)
          }
  
          res.status(200).send(data)
      })  
}

/// create bucket and policy 
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
  
exports.createNewBucketAndPolicy = async (req,res)=>
{
    const params = {
        Bucket : "demorainbowcart10"
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
                // display error message
                // console.log("Error:=> ", err);
                res.send(err)
            } 
            else
            {
                // console.log("Success", data);
                res.send(data)
            }
        });
        
    }
    else
    {
        res.send(bucketObj)
    }

}



// app.post('/upload',upload,(req, res) => {

//     let myFile = req.file.originalname.split(".")
//     const fileType = myFile[myFile.length - 1]

//     const params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `${uuid()}.${fileType}`,
//         Body: req.file.buffer
//     }

//     s3.upload(params, (error, data) => {
//         if(error){
//             res.status(500).send(error)
//         }

//         res.status(200).send(data)
//     })
// })
