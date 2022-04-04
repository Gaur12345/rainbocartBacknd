var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var crypto = require('crypto');
const shortid = require('shortid')
const Razorpay = require('razorpay');

const conn = require("../../Database/DatabaseConn");
const cros = require('cors')
app.use(cros());

//app.use(bodyParser.json());
// Old One
// const razorpay = new Razorpay({
// 	key_id: 'rzp_test_RDwzb7sg5IleAO',
// 	key_secret: 'nQi0ga6KwClK7B7zLQMSxdXR'
// })


const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET
})

exports.verification = (req, res) => {
	// do a validation
	const secret = 'rainbow12345#';
	const crypto = require('crypto')
	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')
	require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	if (digest === req.headers['x-razorpay-signature']) {
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {

	}
	res.json({ status: 'ok' })


	// const crypto = require('crypto')

	// const shasum = crypto.createHmac('sha256', secret)
	// shasum.update(JSON.stringify(req.body))
	// const digest = shasum.digest('hex')

	// //console.log(digest, req.headers['x-razorpay-signature'])

	// if (digest === req.headers['x-razorpay-signature']) {

	//    let val  = req.body

	//     val = JSON.parse(val);

	// 	// let cardID = "";
	// 	// let cardEntity = "";
	// 	// let cardName = "";
	// 	// let cardLast4 = "";
	// 	// let cardNetwork = "";
	// 	// let cardType = "";
	// 	// let cardIssuer = "";
	// 	// let cardInternational = "";
	// 	// let cardEmi = "";
	// 	// let cardSub_type = "";
	// 	// let authCode = "";


	// 	// if(val.payload.payment.entity.method == "card")
	// 	// {

	// 	// 		cardID=val.payload.payment.entity.card.id;
	// 	// 		cardEntity=val.payload.payment.entity.card.entity;
	// 	// 		cardName=val.payload.payment.entity.card.name;
	// 	// 		cardLast4=val.payload.payment.entity.card.last4;
	// 	// 		cardNetwork=val.payload.payment.entity.card.network;
	// 	// 		cardType=val.payload.payment.entity.card.type;
	// 	// 		cardInternational=val.payload.payment.entity.card.international;
	// 	// 		cardEmi=val.payload.payment.entity.card.emi;
	// 	// 		cardSub_type=val.payload.payment.entity.card.sub_type;
	// 	// 		 authCode = val.payload.payment.entity.acquirer_data.auth_code;


	// 	// }
	// 	// else
	// 	// {
	// 	// 	authCode = val.payload.payment.entity.acquirer_data.bank_transaction_id;
	// 	// }




	// 	// let sql = `insert into clientpayment
	// 	//  (account_ID,rPaymentID,amount,currency,status,order_id,invoice_id,international,
	// 	// 	method,amount_refunded,refund_status,captured,card_id,cardentity,cardOwnerName,
	// 	// 	cardlast4Digit,cardNetwork,cardType,cardinternational,cardEmi,cardsub_type,
	// 	// 	bank,wallet,vpa,email,contact,fee,tax,error_code,error_description,error_source,
	// 	// 	error_step,error_reason,auth_code,paymentCreated_at,entityCreated_at) 
	// 	// 	values (?,?,?,?,?,?,?,?,?,?
	// 	// 		,?,?,?,?,?,?,?,?,?,?
	// 	// 		,?,?,?,?,?,?,?,?,?,?,
	// 	// 		?,?,?,?,?,?)`;

	// 	// conn.databaseConn.query(sql,[
	// 	// 	val.account_id,
	// 	// 	val.payload.payment.entity.id,
	// 	// 	val.payload.payment.entity.amount,
	// 	// 	val.payload.payment.entity.currency,
	// 	// 	val.payload.payment.entity.status,
	// 	// 	val.payload.payment.entity.order_id,
	// 	// 	val.payload.payment.entity.invoice_id,
	// 	//     val.payload.payment.entity.international,
	// 	// 	val.payload.payment.entity.method,
	// 	// 	val.payload.payment.entity.amount_refunded,
	// 	// 	val.payload.payment.entity.refund_status,
	// 	// 	val.payload.payment.entity.captured,
	// 	// 	cardID,
	// 	// 	cardEntity,
	// 	//     cardName,
	// 	// 	cardLast4,
	// 	// 	cardNetwork,
	// 	// 	cardType,
	// 	// 	cardInternational,
	// 	// 	cardEmi,
	// 	// 	cardSub_type,
	// 	// 	val.payload.payment.entity.bank,
	// 	// 	val.payload.payment.entity.wallet,
	// 	// 	val.payload.payment.entity.vpa,
	// 	// 	val.payload.payment.entity.email,
	// 	// 	val.payload.payment.entity.contact,
	// 	// 	val.payload.payment.entity.fee,
	// 	// 	val.payload.payment.entity.tax,
	// 	// 	val.payload.payment.entity.error_code,
	// 	// 	val.payload.payment.entity.error_description,
	// 	// 	val.payload.payment.entity.error_source,
	// 	// 	val.payload.payment.entity.error_step,
	// 	// 	val.payload.payment.entity.error_reason,
	// 	// 	authCode,
	// 	// 	val.payload.payment.entity.created_at,
	// 	// 	val.created_at,


	// 	// ],function(error,result){


	// 	// 	if(error)
	// 	// 	{

	// 	// 	}
	// 	// 	else
	// 	// 	{

	// 	// 	}

	// 	// })
	// 	// process it
	// 	require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	// 	console.log("After call this functions Okay !!!! ");
	// } else {

	// 	// pass it
	// }
	// res.json({ status: 'ok' })
}







exports.razorPay = async (req, res) => {

	const payment_capture = 1
	const amount = req.body.amount;
	const currency = 'INR';

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)

		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {

	}

}


// Order Confirm 

async function insertCustomerOrderTable(req) {
	return new Promise((resolve, reject) => {
		let sql = 'insert into customerorder (customerID) values (?)';
		conn.databaseConn.query(sql, [req.body.customerID], function (error, result) {
			if (error) {
				return reject(error);
			}
			else {
				return resolve(result)
			}

		})
	})
}


async function insertIntoCustomerMoreDetails(req, inserted) {

	return new Promise((resolve, reject) => {
		let paytype = "Online Payment";
		let sql2 = `insert into ordermoredeatils
		(orderID,productID,cartID,productTableName,paymentType,dileveryAddId,customerID,proPrice,quantity,orderStatus,deliveryDate) 
		values (?,?,?,?,?,?,?,?,?,?,?)`;

		for (let i = 0; i < req.body.allData.length; i++) {

			conn.databaseConn.query(sql2,
				[
					inserted,
					req.body.allData[i].proID,
					// req.body.allData[i].cid,
					req.body.allData[i].cardID,
					req.body.allData[i].productTable,
					paytype,
					req.body.delAddressID,
					req.body.customerID,
					req.body.allData[i].pPrice,
					req.body.allData[i].pQuantity,
					0,
					req.body.deliveryDate
				], function (error, data) {

					if (error) {
						return reject(error);
					}
					else {
						if (i == req.body.allData.length - 1) {
							return resolve("insertSucessfully")
						}
					}
				})
		}

	})

}

async function updateAddToCartTable(req) {
	return new Promise((resolve, reject) => {
		let sql = `delete from addtocart where cid in (?)`;

		conn.databaseConn.query(sql, [req.body.cartID], function (error, data) {

			if (error) {
				return reject(error)
			}
			else {
				return resolve(data);
			}

		})
	})

}

exports.orderConfirm = async (req, res) => {
	let result = await insertCustomerOrderTable(req);
	let result2 = await insertIntoCustomerMoreDetails(req, result.insertId);
	if (req.body.cartID != null) {
		let result3 = await updateAddToCartTable(req);
		if (result && result2 && result3) {
			res.send("insertSucessfully");
		}
		else {
			res.send("notinserted")
		}
	}
	else {
		if (result && result2) {
			res.send("insertSucessfully");
		}
		else {
			res.send("notinserted")
		}
	}

}

exports.updatePlan = (req, res) => {
	if (req.body.planType === "Basic") {
		let sql = "update registrationtable set paymentType=? ,activatePlan=? where comEmail=?";

		conn.databaseConn.query(sql, [req.body.planType, "1", req.body.emailId], function (err, data) {

			if (err) {
				res.send(err);
			}
			else {
				if (data.affectedRows == 1) {
					res.send("PaymentSuccessfull");
				}
			}


		})

	}
	else if (req.body.planType === "Standard") {
		let sql = "update registrationtable set paymentType=? ,activatePlan=? where comEmail=?";

		conn.databaseConn.query(sql, [req.body.planType, "2", req.body.emailId], function (err, data) {

			if (err) {
				res.send(err);
			}
			else {
				if (data.affectedRows == 1) {
					res.send("PaymentSuccessfull");
				}
			}


		})
	}
	else if (req.body.planType === "Pro") {
		let sql = "update registrationtable set paymentType=? ,activatePlan=? where comEmail=?";

		conn.databaseConn.query(sql, [req.body.planType, "3", req.body.emailId], function (err, data) {

			if (err) {
				res.send(err);
			}
			else {
				if (data.affectedRows == 1) {
					res.send("PaymentSuccessfull");
				}
			}
		})
	}
}




exports.offLinePayment = (req, res) => {

	let sql = 'insert into offlinepayment (comEmail,planType) values (?,?)';

	conn.databaseConn.query(sql, [
		req.body.emailID,
		req.body.planType

	], function (error, data) {


		if (error) {
			res.send(error);
		}
		else {
			if (data.affectedRows == 1) {
				res.send("done");
			}
		}

	})
}


exports.requestForPay = (req, res) => {
	let sql = `insert into paymentrequest (name,email,mobile,planType,planAmt,planDis) values (?,?,?,?,?,?)`;

	conn.databaseConn.query(sql, [

		req.body.clientName,
		req.body.emailID,
		req.body.contactNumber,
		req.body.planType,
		req.body.planAmt,
		req.body.planDis

	], function (error, data) {

		if (error) {
			res.send(error);
		}
		else {
			if (data.affectedRows == 1) {
				res.send("doneData");
			}
		}
	})
}



exports.findPaymentStatus = (req, res) => {
	let sql = `select planType,planAmt,planDis,paymentStatus from paymentrequest where email=? AND paymentStatus=?`;

	conn.databaseConn.query(sql, [req.body.emailID, "1"], function (error, data) {

		if (error) {
			res.send(error);
		}
		else {
			if (data.length == 1) {
				res.send(data);
			}
		}
	})
}





// Ater Predefine