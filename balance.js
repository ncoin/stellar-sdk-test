const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

// HTTP 허용 설정
// StellarSdk.Config.setAllowHttp(true);
// console.log("Is allow http:", StellarSdk.Config.isAllowHttp());

const server = new StellarSdk.Server('https://nstellar-test.ncoin.com');

const Buyer = "SCX4VXACC7CBIQ23DVRRCDTRLY2QQRWBIOLVZVPXX654COLLI3AQZOMN";    // P6

const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);

// the JS SDK uses promises for most actions, such as retrieving an account
server.loadAccount(BuyerKey.publicKey()).then(function(account) {
	console.log(account);

	console.log('Balances for account: ' + BuyerKey.publicKey());
	account.balances.forEach(function(balance) {
		console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
	});
});