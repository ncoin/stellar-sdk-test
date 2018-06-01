const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const SecretMultiSigner_1 = "SD37NEGIC5SM64F2MH5FVILRT3IWEUZBVMPKHRLIDNORVHGZUVXYXXRL";
const SecretMultiSigner_2 = "SBWBGBPVOWM7ZHWR6GGW7MPKA6SX73E4RF6KHT3YWOLP45R6UMMAEYMQ";
const SecretMultiSigner_3 = "SBWZHGTZ4V7L2LGQUMSNNQWEQ3OOACAMRX2H3DFOWF2OSLZKCECVLTCI";
const SecretMultiSigner_4 = "SDKV6VA56I6LT6H73LCKX3VHT7P7F77C7BNCGEXJMTSFE4HWS7YMD7HP";

const DestinationId = "GCHRU5YXGXTMTO35PDZRVG45NQ6W6ANUQYJZNCL7PP4M3E25ADCQFZF6";

const MultiSignerKey_1 = StellarSdk.Keypair.fromSecret(SecretMultiSigner_1);
const MultiSignerKey_2 = StellarSdk.Keypair.fromSecret(SecretMultiSigner_2);
const MultiSignerKey_3 = StellarSdk.Keypair.fromSecret(SecretMultiSigner_3);
const MultiSignerKey_4 = StellarSdk.Keypair.fromSecret(SecretMultiSigner_4);

let transaction;

server.loadAccount(DestinationId)
// If the account is not found, surface a nicer error message for logging.
	.catch(StellarSdk.NotFoundError, function (error) {
		throw new Error('The destination account does not exist!');
	})
	// If there was no error, load up-to-date information on your account.
	.then(function() {
		return server.loadAccount(MultiSignerKey_1.publicKey());
	})
	.then(function(sourceAccount) {
		// Start building the transaction.
		transaction = new StellarSdk.TransactionBuilder(sourceAccount)
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
		transaction.sign(MultiSignerKey_1);
		transaction.sign(MultiSignerKey_2);
		transaction.sign(MultiSignerKey_3);
		transaction.sign(MultiSignerKey_4);

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
