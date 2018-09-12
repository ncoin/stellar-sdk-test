# stellar-sdk-test
stellar sdk test sample codes

```
npm install
```

HTTP 허용 설정 (Javascript SDK)
```
StellarSdk.Config.setAllowHttp(true);
console.log("Is allow http:", StellarSdk.Config.isAllowHttp());
```

- account.js : create account in testnet
- balance.js : get account balance
- multisign.js : set multisignature
- multisign_taransaction.js : transaction from multisignature account
- NCH100.js : change trust
- NCH100_Buy.js : buy NCH100
- NCH100_Loadn.js : loan NCH100