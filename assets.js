const toml = require('toml');
const StellarSdk = require('stellar-sdk');
StellarSdk.Network.usePublicNetwork();

const server = new StellarSdk.Server('https://horizon.stellar.org');

let assets = server.assets();

assets
	.forCode('SIX')
	.forIssuer('GDMS6EECOH6MBMCP3FYRYEVRBIV3TQGLOFQIPVAITBRJUMTI6V7A2X6Z')
	.call()
	.then(function (rst) {
		rst.records.forEach(function (row, i) {
			console.log(i, row);

			// console.log();

			row.toml().then((res) => {
				console.log(toml.parse(res));
			});
		});
	});


// StellarSdk.StellarTomlResolver.resolve('six.network')
// 	.then(stellarToml => {
// 		console.log(stellarToml);
// 	})
// 	.catch(error => {
// 		// stellar.toml does not exist or is invalid
// 	});