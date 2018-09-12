const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const SecretMaster = "SDMQBBJQW5XE4H5JTQLRTDDLLL6FLYBYSASW2S36ZA6BZY5CDA2QW5SP";
const SecretSignerA = "SAAETUPOTOAQ742JKW4ZSLVGTKEPF22IABSLXY7GQI7ESSPLFXGZBBJA";
const SecretSignerB = "SBZSJTHBGG4Q7CD73POQX6A2TZHFHKOYJQXOWZV63GBT3R5VJYFNUGTP";

const KeyMaster = StellarSdk.Keypair.fromSecret(SecretMaster);
const KeySignerA = StellarSdk.Keypair.fromSecret(SecretSignerA);
const KeySignerB = StellarSdk.Keypair.fromSecret(SecretSignerB);

let transaction;

server.loadAccount(KeyMaster.publicKey())
	.catch(StellarSdk.NotFoundError, function (error) {
		throw new Error('The Singer account does not exist!');
	})
	.then(function() {
		return server.loadAccount(KeyMaster.publicKey());
	})
	.then(function(Account) {
		// Start building the transaction.
		transaction = new StellarSdk.TransactionBuilder(Account)
			.addOperation(StellarSdk.Operation.setOptions({
				lowThreshold: 0,
				medThreshold: 0,
				highThreshold: 0,
				signer: {
					ed25519PublicKey: KeySignerA.publicKey(),
					weight: 1
				}
			}))

			.addOperation(StellarSdk.Operation.setOptions({
				signer: {
					ed25519PublicKey: KeySignerB.publicKey(),
					weight: 1
				}
			}))
			//
			// .addOperation(StellarSdk.Operation.setOptions({
			// 	masterWeight: 1
			// }))

			.build();

		transaction.sign(KeyMaster);
		// transaction.sign(KeySignerA);
		// transaction.sign(KeySignerB);

		return server.submitTransaction(transaction);
	})
	.then(function(result) {
		console.log('Success! Results:', result);
	})
	.catch(function(error) {
		console.error('Something went wrong!', error);
		// console.error('Result XDR:', StellarSdk.xdr.TransactionResult.fromXDR(error.data.extras.result_xdr, 'base64'));
	});
