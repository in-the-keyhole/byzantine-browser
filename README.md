# khs-blockchain-browser
KHS Blockchain Browser


React/Node.js web application that allows you to browse and observe real-time activity in Hyperledger blockchain networks.

![](images/khs-block-browser.png)

### Real-time Blockchain Metrics

![](images/blockbrowsermetrics.png)

## Requirements
* [Node](https://nodejs.org/en/download/) 8.9.x or above
* `Windows OS Only` - [Python](https://www.python.org/downloads/) 2.7+ (v3+ not supported)
* Access to HyperLedger Fabric network. Here's an example: [khs-lab-results-blockchain](https://github.com/in-the-keyhole/khs-lab-results-blockchain)

Note: Two useful tools for managing Node and Python versions are [nvm](https://github.com/creationix/nvm) and [pyenv](https://github.com/pyenv/pyenv).

## Installation 
1. Clone repo
2. Install server and UI JavaScript modules 


```
    $ npm install 
    $ cd ui
    $ npm install 
    $ cd ..
```

3. The current keystore has credentials for the Hyperledger example networks. You can access other networks by modifying the `config.js` so that the `network_url` property points to a peer node address and an admin `USERID` property references an admin user and public/private keys located in the `hfc-key-store` folder.

```
    module.exports = {
        port: process.env.PORT || 4001,
        host: process.env.HOST || "localhost",
        loglevel: process.env.LOGLEVEL || "info",
        wallet_path: process.env.KEYSTORE || "../hfc-key-store",
        user_id: process.env.USERID || "PeerAdmin",
        network_url: process.env.NETWORK_URL || "grpc://localhost:7051"  
    }
```

Here is an example public/private and user file in the `hfc-key-store` directory. 

![](images/keystore.png)

4. Start the API Server and UI server with the following commands:

```
    $ ./runApiServer.sh 
    $ cd ui 
    $ npm start 
```

5. Browse to [`http://localhost:8080`](http://localhost:8080).

Note: to change the port, edit file `./ui/package.json`.
