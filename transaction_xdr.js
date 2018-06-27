const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const source = "SBYL6P3XWV3XPB7Y7NVFCKCGF32IP4WT5YTIIAMTVGVFND53ECVE4TIR";

const sourceKey = StellarSdk.Keypair.fromSecret(source);

const xdr = "AAAAAI8adxc15sm7fXjzGpudbD1vAbSGE5aJf3v4zZNdAMUCAAAAZACI550AAABgAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAAx6NrIeiSMSOBtqtX52SizbwghHfYxLBc/YIKw6XF6asAAAAAAAAAAAX14QAAAAAAAAAAAA==";

let transaction = new StellarSdk.Transaction(xdr);


transaction.sign(sourceKey);

server.submitTransaction(transaction)
	.then(function(result) {
		console.log('Success! Results:', result);
	})
	.catch(function(error) {
		console.error('Something went wrong!', error);
	});
