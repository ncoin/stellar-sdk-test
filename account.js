const StellarSdk = require('stellar-sdk');
const pair = StellarSdk.Keypair.random();

console.log(pair.secret());
console.log(pair.publicKey());

console.log("");

const request = require('request');
request.get({
	url: 'https://friendbot.stellar.org',
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