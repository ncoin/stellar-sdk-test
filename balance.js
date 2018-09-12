// const StellarSdk = require('stellar-sdk');
// StellarSdk.Network.useTestNetwork();

// HTTP 허용 설정
// StellarSdk.Config.setAllowHttp(true);
// console.log("Is allow http:", StellarSdk.Config.isAllowHttp());

// const server = new StellarSdk.Server('https://nstellar-test.ncoin.com');


// const from_secret = "SDZ3M2C4LIHYZLWFAF4DXBVIXOSTKYRXRR56QIPBHRANF6LDRFE7USMK";
// const to_public = "GC7G4ACHR7BCQVMRLFFFOEMKJVSBZHKUUGFGOSIZGL5WQRYKAJLFQYAC";
//
// const StellarSdk = require('stellar-sdk');
// StellarSdk.Config.setAllowHttp(true);
// StellarSdk.Network.useTestNetwork();
//
// const server = new StellarSdk.Server('http://192.168.5.231:8000');

const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://nstellar.dev.ncoin.com');

const Buyer = "SDZ3M2C4LIHYZLWFAF4DXBVIXOSTKYRXRR56QIPBHRANF6LDRFE7USMK";    // P6

const BuyerKey = StellarSdk.Keypair.fromSecret(Buyer);

// the JS SDK uses promises for most actions, such as retrieving an account
server.loadAccount(BuyerKey.publicKey()).then(function(account) {
	console.log(account);

	console.log('Balances for account: ' + BuyerKey.publicKey());
	account.balances.forEach(function(balance) {
		console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
	});
});