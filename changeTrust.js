const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const Buyer = "SB7KZXXZNWPP22PN7WI773FWSOFP2IF2ATTZX3NMICXOPPDIPGXEVCZN";    // P6
const Issuer = "SCX4VXACC7CBIQ23DVRRCDTRLY2QQRWBIOLVZVPXX654COLLI3AQZOMN";

const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);
const IssuerKey = StellarSdk.Keypair.fromSecret(Issuer);

// Transaction will hold a built transaction we can resubmit if the result is unknown.
let transaction;

// First, check to make sure that the destination account exists.
// You could skip this, but if the account does not exist, you will be charged
// the transaction fee when the transaction fails.
server.loadAccount(BuyerKey.publicKey())
// If the account is not found, surface a nicer error message for logging.
	.catch(StellarSdk.NotFoundError, function (error) {
		throw new Error('The destination account does not exist!');
	})
	// If there was no error, load up-to-date information on your account.
	.then(function() {
		return server.loadAccount(BuyerKey.publicKey());
	})
	.then(function(account) {
		let nch200 = new StellarSdk.Asset("NCH200", IssuerKey.publicKey());

		// change trust
		transaction = new StellarSdk.TransactionBuilder(account)
			.addOperation(StellarSdk.Operation.changeTrust({
				asset: nch200
			}))

			.build();

		transaction.sign(BuyerKey);

		// post transaction
		return server.submitTransaction(transaction);
	})
	.then(function(result) {
		console.log('Success! Results:', result);
	})
	.catch(function(error) {
		console.error('Something went wrong!', error);
		// If the result is unknown (no response body, timeout etc.) we simply resubmit
		// already built transaction:
		// server.submitTransaction(transaction);
	});