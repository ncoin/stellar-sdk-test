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
		let amount = 1000;
		let rate = 0.5;
		let xlmusd = 0.286329;
		let loanAmount = (amount * rate) * xlmusd;

		// console.log(invoice.toFixed(7));

		transaction = new StellarSdk.TransactionBuilder(BuyerAccount)
			// .addOperation(StellarSdk.Operation.changeTrust({
			// 	asset: nch100
			// }))

			// transfer XLM to loan account
			.addOperation(StellarSdk.Operation.payment({
				destination: LoanKey.publicKey(),
				asset: StellarSdk.Asset.native(),
				amount: amount.toString()
			}))

			// transfer NCH100 to seller account from loan account
			.addOperation(StellarSdk.Operation.payment({
				destination: LoanKey.publicKey(),
				asset: nch100,
				amount: loanAmount.toFixed(7),
				source: IssuerKey.publicKey()
			}))

			// transfer NCH100 to buyer account from loan account
			.addOperation(StellarSdk.Operation.payment({
				destination: BuyerKey.publicKey(),
				asset: nch100,
				amount: loanAmount.toFixed(7),
				source: LoanKey.publicKey()
			}))
			.build();

		transaction.sign(IssuerKey);
		transaction.sign(BuyerKey);
		transaction.sign(LoanKey);

		return server.submitTransaction(transaction);
	})
	.then(function(result) {
		console.log('Success! Results:', result);
	})
	.catch(function(error) {
		console.error('Something went wrong!', error);
	});