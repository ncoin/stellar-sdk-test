const StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const publicKey = "GBJUL6KZOOMZOI46CURFO4P3FGHJAP4DHZM45G7QMDA4JRYOBLHVKTVT";

// the JS SDK uses promises for most actions, such as retrieving an account
server.loadAccount(publicKey).then(function(account) {
	// console.log(account);

	console.log('Balances for account: ' + publicKey);
	account.balances.forEach(function(balance) {
		console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
	});
});