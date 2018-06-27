const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


//the JS SDK uses promises for most actions, such as retrieving an account
server.loadAccount("GC25ARNIPABTVIKYE5OEXM34D62SXPFEGCDGZ2QDD3OJPNYLFPGRG3L3").then(function(account) {
	console.log(account);

	console.log('Balances for account: GC25ARNIPABTVIKYE5OEXM34D62SXPFEGCDGZ2QDD3OJPNYLFPGRG3L3');
	account.balances.forEach(function(balance) {
		console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
	});
});