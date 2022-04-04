const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
var path = require('path');
let fs = require('fs');
const fileUpload = require('express-fileupload');
const multer = require('multer')
app.use(bodyParser.json())
//app.use(app.static('public'));
app.use(fileUpload());

app.use(cors())
app.use(bodyParser.json())
//app.use(express.static('public'));

const {verifyTokenForCustomer,verifyTokenForSeller} = require('./controller/utils/Utils');
const {
	userRegistration,userLogin,allData,
	ShowAllCompany,addComPro,allRegProduct,
	addNewProduct,allRegColors,AddColor,
	addProductStock,showAllProduct,getProductInfo,
	deleteProduct,getProductImage,updateProduct,verifyEmail,formVerification,fetchdataseller,completeUserRegistration} = require('./controller/sellerUser/UserApis');

const {getProfileData} = require('./controller/sellerUser/ProfileInfo');


// Start Order Details 

const {totalNewOrder,viewNewOrdeAll,newOrderDetails,getCustomerAddress,
	getCustomerDetails,getCustomerInfoAddress,getShopDetails,
	confirmOrder,storeInvoice,updatesellerinventory,viewHistoryOrderAll,HistoryOrderDetails,ReturnOrderInfo,getTotalCustomer,getTotalCustomerInfo} = require('./controller/sellerUser/OrderDetails');
/// seller
const {sellerCheckEmail,sellerForgotPassword,editSellerProfileInformation}= require('./controller/sellerUser/PersonalInfo');

/// Start CustomerUser 

const {searchShop,showAllShopProduct,addTOCart,showCartItem,
	removeFormCart,customerRegistration,customerLogin,incrementDecrementItem,incrementDecrementItembuynow,
	customerAddress,addDeliveryAddress,customerEmailCheck,editDeliveryAddress,forgotCustomerPassword,showAllShopProductImage} = require('./controller/customerUser/CustomerUser');

// For Payment 
const {razorPay , verification ,orderConfirm} = require('./controller/customerUser/PaymentPro');
const {MyOrders,orderMoreDetails,getSellerDetails,getShippingDetails,getCustomerInformation,editSaveInformation,cancelOrder,removeProductFromCart} = require("./controller/customerUser/OrdersPersonInfo");

// Delivery Boy

const {deliveryBoySignUp,deliveryBoyLogin,deliveryBoyCheckEmail,deliveryBoyForgetPassword} = require('./controller/DeliveryBoy/DeliveryBoy');

// send mail 
const {sendMail, sendClientMail} = require("./controller/utils/SendMailApiEvent");

// s3 bucket 
const {uploadFile,createNewBucketAndPolicy} = require("./controller/sellerUser/S3Bucket/UploadProductImage");

const port = process.env.APPLICATION_PORT_NUMBER;

app.post("/userRegistration",userRegistration);
app.post("/verifyEmail",verifyEmail);
app.post("/userLogin",userLogin);
app.post("/formVerification",[verifyTokenForSeller],formVerification)
app.post("/allData",[verifyTokenForSeller],allData);

app.post("/completeUserRegistration",[verifyTokenForSeller],completeUserRegistration);
app.post("/ShowAllCompany",[verifyTokenForSeller],ShowAllCompany);

app.post('/fetchdataseller',[verifyTokenForSeller],fetchdataseller);
app.post('/addComPro',[verifyTokenForSeller],addComPro);

app.post('/allRegProduct',[verifyTokenForSeller],allRegProduct);

app.post('/addNewProduct',[verifyTokenForSeller],addNewProduct);

app.post('/allRegColors',[verifyTokenForSeller],allRegColors);

app.post('/AddColor',[verifyTokenForSeller],AddColor);

app.post('/addProductStock',[verifyTokenForSeller],addProductStock);

app.post('/showAllProduct',[verifyTokenForSeller],showAllProduct);

app.post('/getProductInfo',[verifyTokenForSeller],getProductInfo);

app.post('/deleteProduct',[verifyTokenForSeller],deleteProduct);

app.post('/getProductImage',[verifyTokenForSeller],getProductImage);

app.post('/showAllShopProductImage',showAllShopProductImage);

app.post('/updateProduct',[verifyTokenForSeller],updateProduct);

app.post('/getProfileData',[verifyTokenForSeller],getProfileData);
app.post('/editDeliveryAddress1',[verifyTokenForCustomer],editDeliveryAddress);
app.post('/editDeliveryAddress',[verifyTokenForSeller],editDeliveryAddress);
app.post('/newOrderDetails',[verifyTokenForSeller],newOrderDetails);

app.post('/getCustomerAddress',[verifyTokenForSeller],getCustomerAddress);

app.post('/getCustomerDetails',[verifyTokenForCustomer],getCustomerDetails);
app.post('/getCustomerDetails1',[verifyTokenForSeller],getCustomerDetails);
app.post('/getCustomerInfoAddress',[verifyTokenForSeller],getCustomerInfoAddress);
app.post('/getCustomerInformation',[verifyTokenForCustomer],getCustomerInformation);
app.post('/removeProductFromCart',[verifyTokenForCustomer],removeProductFromCart);
app.post('/getShopDetails',[verifyTokenForSeller],getShopDetails);

app.post("/confirmOrder",[verifyTokenForSeller],confirmOrder);
app.post("/storeInvoice",[verifyTokenForSeller],storeInvoice);
app.post('/updatesellerinventory',[verifyTokenForSeller],updatesellerinventory);
/// seller 
app.post('/sellerCheckEmail',sellerCheckEmail);
app.post("/sellerCheckEmail",sellerCheckEmail);
app.post("/sellerForgotPassword",sellerForgotPassword);
app.post("/editSellerProfileInformation",[verifyTokenForSeller],editSellerProfileInformation)
app.post("/getTotalCustomer",[verifyTokenForSeller],getTotalCustomer);
// Start shop Details 

app.post('/totalNewOrder',[verifyTokenForSeller],totalNewOrder);
app.post('/viewNewOrdeAll',[verifyTokenForSeller],viewNewOrdeAll)
app.post('/viewHistoryOrderAll',[verifyTokenForSeller],viewHistoryOrderAll);
app.post('/HistoryOrderDetails',[verifyTokenForSeller],HistoryOrderDetails);
app.post('/ReturnOrderInfo',[verifyTokenForSeller],ReturnOrderInfo);
app.post('/getTotalCustomer',[verifyTokenForSeller],getTotalCustomer);
app.post('/getTotalCustomerInfo',[verifyTokenForSeller],getTotalCustomerInfo);
// Start for the customerUser 
app.post('/getSellerDetails',[verifyTokenForCustomer],getSellerDetails);
app.post('/orderMoreDetails',[verifyTokenForCustomer],orderMoreDetails);
app.post('/forgotCustomerPassword',forgotCustomerPassword);
app.post('/customerEmailCheck',customerEmailCheck);
app.post('/sendMail',sendMail);
app.post('/sendClientMail',sendClientMail);
app.post('/searchShop',searchShop);
app.post('/cancelOrder',[verifyTokenForCustomer],cancelOrder);

app.post('/showAllShopProduct',showAllShopProduct);

app.post('/addTOCart',[verifyTokenForCustomer],addTOCart);

app.post("/showCartItem",[verifyTokenForCustomer], showCartItem);
app.post("/incrementDecrementItem",[verifyTokenForCustomer],incrementDecrementItem);
app.post("/incrementDecrementItembuynow",[verifyTokenForCustomer],incrementDecrementItembuynow);
app.post("/removeFormCart",[verifyTokenForCustomer], removeFormCart);

app.post("/customerRegistration",customerRegistration);

app.post("/customerLogin",customerLogin);

app.post("/customerAddress",[verifyTokenForCustomer],customerAddress);

app.post("/addDeliveryAddress",[verifyTokenForCustomer],addDeliveryAddress);

// for the payment 

app.post('/razorpay',[verifyTokenForCustomer],razorPay);

app.post('/verification',[verifyTokenForCustomer],verification);

app.post('/orderConfirm',[verifyTokenForCustomer],orderConfirm);

// Customer Order details

app.post("/MyOrders",[verifyTokenForCustomer],MyOrders);
app.post("/orderMoreDetails",[verifyTokenForCustomer],orderMoreDetails);
app.post("/getShippingDetails",[verifyTokenForCustomer],getShippingDetails);
app.post("/getSellerDetails",[verifyTokenForCustomer],getSellerDetails);
app.post("/editSaveInformation",[verifyTokenForCustomer],editSaveInformation);
app.post("/customerEmailCheck",customerEmailCheck);
app.post("/editDeliveryAddress",[verifyTokenForCustomer],editDeliveryAddress);
app.post("/forgotCustomerPassword",forgotCustomerPassword);
// shop side 


app.post('/newOrderDetails',newOrderDetails);

app.post('/getCustomerAddress',getCustomerAddress);

app.post('/getCustomerDetails',getCustomerDetails);

app.post('/getCustomerInfoAddress',getCustomerInfoAddress);

// app.post('/getCustomerInformation',getCustomerInformation);

app.post('/getShopDetails',getShopDetails);

app.post("/confirmOrder",confirmOrder);

app.post("/storeInvoice",storeInvoice);

// Deliver Boy 

app.post("/deliveryBoySignUp",deliveryBoySignUp);
app.post("/deliveryBoyForgetPassword",deliveryBoyForgetPassword);
app.post("/deliveryBoyLogin",deliveryBoyLogin);

app.post('/deliveryBoyCheckEmail',deliveryBoyCheckEmail);

// sendMail

// S3 call

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).array('image')
app.post("/uploadFileSBucket",uploadFile);


app.listen(port, () => {

})