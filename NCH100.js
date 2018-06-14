const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// const Buyer = "SBYL6P3XWV3XPB7Y7NVFCKCGF32IP4WT5YTIIAMTVGVFND53ECVE4TIR";    // P1
// const Buyer = "SDA4VNK7G4AFXLERM6KP42WP2FSX3UH7FMBOWWGPGLEPQ4LAKO4UV5UH";    // P2
const Buyer = "SBWSHHDEQO4GT2FAT32ABJQOBVPLEYUTPYTTLTBIB2SQUM4YPOGZPLCP";    // P3
const Issuer = "SBCJEQRONAQ533FEAUXSYDB373SN5AQEERWLLQ3PXJE4QYPJGEI73TTD";

const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);
const IssuerKey = StellarSdk.Keypair.fromSecret(Issuer);

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

		// change trust
		transaction = new StellarSdk.TransactionBuilder(account)
			.addOperation(StellarSdk.Operation.changeTrust({
				asset: nch100
			}))

			.build();

		transaction.sign(BuyerKey);

		return server.submitTransaction(transaction);
	})
	.then(function(result) {
		console.log('Success! Results:', result);
	})
	.catch(function(error) {
		console.error('Something went wrong!', error);
	});