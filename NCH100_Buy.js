const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const Buyer = "SDA4VNK7G4AFXLERM6KP42WP2FSX3UH7FMBOWWGPGLEPQ4LAKO4UV5UH";

const Issuer = "SBCJEQRONAQ533FEAUXSYDB373SN5AQEERWLLQ3PXJE4QYPJGEI73TTD";
const Seller = "SA6PDGIJELKKDOFLSJRMCGA7KE65A6EHNQZXTJEY5TQTGSUH4O3NK2Q3";
const Loan = "SC6ZEE6RNDJIBU7KN25GDOWZMENLDFXMO7PYB753SXEWNSO4ENAW7DPB";

const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);

const IssuerKey = StellarSdk.Keypair.fromSecret(Issuer);
const SellerKey = StellarSdk.Keypair.fromSecret(Seller);
const LoanKey = StellarSdk.Keypair.fromSecret(Loan);

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
	.then(function(BuyerAccount) {
		let nch100 = new StellarSdk.Asset("NCH100", IssuerKey.publicKey());
		let amount = 100;
		let price = 0.288646;
		let invoice = amount * price;

		// console.log(invoice.toFixed(7));

		transaction = new StellarSdk.TransactionBuilder(BuyerAccount)
			// .addOperation(StellarSdk.Operation.changeTrust({
			// 	asset: nch100
			// }))

			// create offer
			.addOperation(StellarSdk.Operation.manageOffer({
				selling: StellarSdk.Asset.native(),
				buying: nch100,
				amount: amount.toString(),
				price: price,
				offerId: 0
			}))

			// transfer NCH100 to seller account from issue account
			.addOperation(StellarSdk.Operation.payment({
				destination: SellerKey.publicKey(),
				asset: nch100,
				amount: invoice.toFixed(7),
				source: IssuerKey.publicKey()
			}))

			// trade seller account between buyer account
			.addOperation(StellarSdk.Operation.pathPayment({
				destination: SellerKey.publicKey(),
				destAsset: StellarSdk.Asset.native(),
				destAmount: amount.toString(),
				sendAsset: nch100,
				sendMax: "100000",
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