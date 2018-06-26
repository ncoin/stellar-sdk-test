const toml = require('toml');
const StellarSdk = require('stellar-sdk');
StellarSdk.Network.usePublicNetwork();

const server = new StellarSdk.Server('https://horizon.stellar.org');

let assets = [
	{code:'SIX', issuer:'GDMS6EECOH6MBMCP3FYRYEVRBIV3TQGLOFQIPVAITBRJUMTI6V7A2X6Z'},
	{code:'CNY', issuer:'GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX'}
];

assets.forEach(function (asset, idx) {
	server.assets()
		.forCode(asset.code)
		.forIssuer(asset.issuer)
		.call()
		.then(function (rst) {
			rst.records.forEach(function (row, i) {
				console.log(i, row);

				row.toml().then((res) => {
					console.log(toml.parse(res));
				});
			});
		});
});

// get asset information
// server.assets()
// 	.forCode('SIX')
// 	.forIssuer('GDMS6EECOH6MBMCP3FYRYEVRBIV3TQGLOFQIPVAITBRJUMTI6V7A2X6Z')
// 	.call()
// 	.then(function (rst) {
// 		rst.records.forEach(function (row, i) {
// 			console.log(i, row);
//
// 			row.toml().then((res) => {
// 				console.log(toml.parse(res));
// 			});
// 		});
// 	});

// StellarSdk.StellarTomlResolver.resolve('six.network')
// 	.then(stellarToml => {
// 		console.log(stellarToml);
// 	})
// 	.catch(error => {
// 		// stellar.toml does not exist or is invalid
// 	});