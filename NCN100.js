const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const Issuer = "SBCJEQRONAQ533FEAUXSYDB373SN5AQEERWLLQ3PXJE4QYPJGEI73TTD";
const Seller = "SC73E2XZDZBEELX2GW7565LB5SKSYXWWSIXRSO6NYD2ELVN5ZVLNR3YN";
const Buyer = "SDA4VNK7G4AFXLERM6KP42WP2FSX3UH7FMBOWWGPGLEPQ4LAKO4UV5UH";

const IssuerKey = StellarSdk.Keypair.fromSecret(Issuer);
const SellerKey = StellarSdk.Keypair.fromSecret(Seller);
const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);

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
		let NCH = new StellarSdk.Asset("ETH", "GA2DKVSPTZVC4JUFJBXNUPRR6WONWK4RVH7KHYD6P7WB6D4J2WRK3BGH");

		transaction = new StellarSdk.TransactionBuilder(BuyerAccount)
			.addOperation(StellarSdk.Operation.changeTrust({
				asset: eth
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