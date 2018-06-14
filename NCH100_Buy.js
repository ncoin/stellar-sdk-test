const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const Buyer = "SBYL6P3XWV3XPB7Y7NVFCKCGF32IP4WT5YTIIAMTVGVFND53ECVE4TIR";

const Issuer = "SBCJEQRONAQ533FEAUXSYDB373SN5AQEERWLLQ3PXJE4QYPJGEI73TTD";
const Seller = "SA6PDGIJELKKDOFLSJRMCGA7KE65A6EHNQZXTJEY5TQTGSUH4O3NK2Q3";

const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);

const IssuerKey = StellarSdk.Keypair.fromSecret(Issuer);
const SellerKey = StellarSdk.Keypair.fromSecret(Seller);

let transaction;

// the JS SDK uses promises for most actions, such as retrieving an account
server.loadAccount(BuyerKey.publicKey())
	.catch(StellarSdk.NotFoundError, function (error) {
		throw new Error('The Singer account does not exist!');
	})
	// If there was no error, load up-to-date information on your account.
	.then(function() {
		return server.loadAccount(BuyerKey.publicKey());
	})
	.then(function(account) {
		let nch100 = new StellarSdk.Asset("NCH100", IssuerKey.publicKey());
		let amount = 100;
		let price = 0.401985;
		let invoice = amount * price;

		// console.log(invoice.toFixed(7));

		transaction = new StellarSdk.TransactionBuilder(account)

			// XLM transfer to seller account from buyer account
			.addOperation(StellarSdk.Operation.payment({
				destination: SellerKey.publicKey(),
				asset: StellarSdk.Asset.native(),
				amount: amount.toString()
			}))

			// transfer NCH100 to seller account from issuer account
			.addOperation(StellarSdk.Operation.payment({
				destination: SellerKey.publicKey(),
				asset: nch100,
				amount: invoice.toFixed(7),
				source: IssuerKey.publicKey()
			}))

			// transfer NCH100 to buyer account from seller account
			.addOperation(StellarSdk.Operation.payment({
				destination: BuyerKey.publicKey(),
				asset: nch100,
				amount: invoice.toFixed(7),
				source: SellerKey.publicKey()
			}))

			.build();

		transaction.sign(BuyerKey);
		transaction.sign(IssuerKey);
		transaction.sign(SellerKey);

		return server.submitTransaction(transaction);
	})
	.then(function(result) {
		console.log('Success! Results:', result);
	})
	.catch(function(error) {
		console.error('Something went wrong!', error);
	});