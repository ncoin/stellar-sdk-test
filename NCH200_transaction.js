const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const Buyer = "SBWSHHDEQO4GT2FAT32ABJQOBVPLEYUTPYTTLTBIB2SQUM4YPOGZPLCP";    // P3
const Issuer = "SCX4VXACC7CBIQ23DVRRCDTRLY2QQRWBIOLVZVPXX654COLLI3AQZOMN";

const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);
const IssuerKey = StellarSdk.Keypair.fromSecret(Issuer);

// Transaction will hold a built transaction we can resubmit if the result is unknown.
let transaction;

// First, check to make sure that the destination account exists.
// You could skip this, but if the account does not exist, you will be charged
// the transaction fee when the transaction fails.
server.loadAccount(IssuerKey.publicKey())
// If the account is not found, surface a nicer error message for logging.
	.catch(StellarSdk.NotFoundError, function (error) {
		throw new Error('The destination account does not exist!');
	})
	// If there was no error, load up-to-date information on your account.
	.then(function() {
		return server.loadAccount(IssuerKey.publicKey());
	})
	.then(function(account) {
		let nch200 = new StellarSdk.Asset("NCH200", IssuerKey.publicKey());

		// Start building the transaction.
		transaction = new StellarSdk.TransactionBuilder(account)
			.addOperation(StellarSdk.Operation.payment({
				destination: BuyerKey.publicKey(),
				asset: nch200,
				amount: "100000"
			}))
			.addMemo(StellarSdk.Memo.text('NCH200 Transaction'))
			.build();

		// signing
		transaction.sign(IssuerKey);

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