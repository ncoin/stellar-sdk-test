const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const SecretMaster = "SDMQBBJQW5XE4H5JTQLRTDDLLL6FLYBYSASW2S36ZA6BZY5CDA2QW5SP";
const SecretSignerA = "SAAETUPOTOAQ742JKW4ZSLVGTKEPF22IABSLXY7GQI7ESSPLFXGZBBJA";
const SecretSignerB = "SBZSJTHBGG4Q7CD73POQX6A2TZHFHKOYJQXOWZV63GBT3R5VJYFNUGTP";

const KeyMaster = StellarSdk.Keypair.fromSecret(SecretMaster);
const KeySignerA = StellarSdk.Keypair.fromSecret(SecretSignerA);
const KeySignerB = StellarSdk.Keypair.fromSecret(SecretSignerB);

const DestinationId = "GCHRU5YXGXTMTO35PDZRVG45NQ6W6ANUQYJZNCL7PP4M3E25ADCQFZF6";

let transaction;

server.loadAccount(DestinationId)
// If the account is not found, surface a nicer error message for logging.
	.catch(StellarSdk.NotFoundError, function (error) {
		throw new Error('The destination account does not exist!');
	})
	// If there was no error, load up-to-date information on your account.
	.then(function() {
		return server.loadAccount(KeyMaster.publicKey());
	})
	.then(function(Account) {
		// Start building the transaction.
		transaction = new StellarSdk.TransactionBuilder(Account)
			.addOperation(StellarSdk.Operation.payment({
				destination: DestinationId,
				asset: StellarSdk.Asset.native(),
				amount: "10"
			}))
			// A memo allows you to add your own metadata to a transaction. It's
			// optional and does not affect how Stellar treats the transaction.
			.addMemo(StellarSdk.Memo.text('Multi Sign Test Transaction'))
			.build();
		// Sign the transaction to prove you are actually the person sending it.
		transaction.sign(KeyMaster);
		transaction.sign(KeySignerA);
		transaction.sign(KeySignerB);

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
