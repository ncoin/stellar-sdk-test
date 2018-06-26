const StellarSdk = require('stellar-sdk');
StellarSdk.Network.use('Standalone Network ; February 2017');

// HTTP 허용 설정
StellarSdk.Config.setAllowHttp(true);
console.log("Is allow http:", StellarSdk.Config.isAllowHttp());

const server = new StellarSdk.Server('http://localhost:8000');

console.log(server);

const pair = StellarSdk.Keypair.random();

console.log("P: ", pair.publicKey());
console.log("S: ", pair.secret());

const request = require('request');
request.get({
	url: 'http://localhost:8000/friendbot',
	qs: {addr: pair.publicKey()},
	json: true
}, function (error, response, body) {
	if (error || response.statusCode !== 200) {
		console.error('ERROR!', error || body);
	}
	else {
		console.log('SUCCESS! You have a new account :)\n', body);
	}
});


// the JS SDK uses promises for most actions, such as retrieving an account
// server.loadAccount(pair.publicKey()).then(function(account) {
// 	console.log(account);
//
// 	console.log('Balances for account: ' + pair.publicKey());
// 	account.balances.forEach(function(balance) {
// 		console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
// 	});
// });