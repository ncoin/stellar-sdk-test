const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const Issuer = "SBCJEQRONAQ533FEAUXSYDB373SN5AQEERWLLQ3PXJE4QYPJGEI73TTD";  // Issuer
const Buyer = "SBYL6P3XWV3XPB7Y7NVFCKCGF32IP4WT5YTIIAMTVGVFND53ECVE4TIR";   // p1
const Seller = "SC73E2XZDZBEELX2GW7565LB5SKSYXWWSIXRSO6NYD2ELVN5ZVLNR3YN"; 	// Distribution

const IssuerKey = StellarSdk.Keypair.fromSecret(Issuer);
const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);
const SellerKey = StellarSdk.Keypair.fromSecret(Seller);

let transaction;

// the JS SDK uses promises for most actions, such as retrieving an account
server.loadAccount(IssuerKey.publicKey())
	.catch(StellarSdk.NotFoundError, function (error) {
		throw new Error('The Singer account does not exist!');
	})
	// If there was no error, load up-to-date information on your account.
	.then(function() {
		return server.loadAccount(IssuerKey.publicKey());
	})
	.then(function(account) {
		let ncn100 = new StellarSdk.Asset("NCN100", IssuerKey.publicKey());

		transaction = new StellarSdk.TransactionBuilder(account)
			// .addOperation(StellarSdk.Operation.changeTrust({
			// 	asset: asset
			// }))
			// .addOperation(StellarSdk.Operation.manageOffer({
			// 	amount: "100",
			// 	price: 0.5,
			// 	offerId: 0
			// }))
			.addOperation(StellarSdk.Operation.pathPayment({
				destination: IssuerKey.publicKey(),
				destAsset: StellarSdk.Asset.native(),
				destAmount: "800",
				sendAsset: ncn100,
				sendMax: "1000"
			}))
			.build();

		transaction.sign(IssuerKey);

		return server.submitTransaction(transaction);
	})
	.then(function(result) {
		console.log('Success! Results:', result);
	})
	.catch(function(error) {
		console.error('Something went wrong!', error);
	});