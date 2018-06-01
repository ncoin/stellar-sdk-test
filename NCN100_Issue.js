const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const Issuer = "SBCJEQRONAQ533FEAUXSYDB373SN5AQEERWLLQ3PXJE4QYPJGEI73TTD";
const Distribution = "SC73E2XZDZBEELX2GW7565LB5SKSYXWWSIXRSO6NYD2ELVN5ZVLNR3YN";

const IssuerKey = StellarSdk.Keypair.fromSecret(Issuer);
const DistributionKey = StellarSdk.Keypair.fromSecret(Distribution);

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
	.then(function(IssueAccount) {
		let asset = new StellarSdk.Asset("NCN100", IssuerKey.publicKey());

		transaction = new StellarSdk.TransactionBuilder(IssueAccount)
			.addOperation(StellarSdk.Operation.payment({
				destination: DistributionKey.publicKey(),
				asset: asset,
				amount: "1000000000"
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