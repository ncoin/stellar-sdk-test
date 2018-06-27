const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const Issuer = "SBCJEQRONAQ533FEAUXSYDB373SN5AQEERWLLQ3PXJE4QYPJGEI73TTD";
const Seller = "SC73E2XZDZBEELX2GW7565LB5SKSYXWWSIXRSO6NYD2ELVN5ZVLNR3YN";
const Buyer = "SDA4VNK7G4AFXLERM6KP42WP2FSX3UH7FMBOWWGPGLEPQ4LAKO4UV5UH";
const Distribution = "SC73E2XZDZBEELX2GW7565LB5SKSYXWWSIXRSO6NYD2ELVN5ZVLNR3YN";


const IssuerKey = StellarSdk.Keypair.fromSecret(Issuer);
const SellerKey = StellarSdk.Keypair.fromSecret(Seller);
const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);
const DistributionKey = StellarSdk.Keypair.fromSecret(Distribution);
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
		let eth = new StellarSdk.Asset("ETH",  IssuerKey.publicKey());

		transaction = new StellarSdk.TransactionBuilder(BuyerAccount)
			.addOperation(StellarSdk.Operation.changeTrust({
				asset: eth
			}))
			.build();

		transaction.sign(BuyerKey);

		return server.submitTransaction(transaction);
	})
	.then(function() {
		return server.loadAccount(DistributionKey.publicKey());
	})
	.then(function(DistributionAccount) {
		let eth = new StellarSdk.Asset("ETH",  IssuerKey.publicKey());

		transaction = new StellarSdk.TransactionBuilder(DistributionAccount)
			.addOperation(StellarSdk.Operation.changeTrust({
				asset: eth
			}))
			.build();

		transaction.sign(DistributionKey);

		return server.submitTransaction(transaction);
	})

	.then(function(result) {
		console.log('Success! Results:', result);
	})
	.catch(function(error) {
		console.error('Something went wrong!', error);
	});