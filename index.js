//var Web3 = require('web3');
//const Tx = require('ethereumjs-tx'); 

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/6a68c430ab2e43adb0762c4cfa9bbb42"));

/*var kycContract = web3.eth.contract(abi);
var deployedContract = kycContract.new({
    data: binaryData,
    from: web3.eth.accounts[0],
    gas: 4700000
});
var contractInstance = kycContract.at(contractAddress);*/
const contractInstance = new web3.eth.Contract(abi, contractAddress);
var keyStoreEnc;

if (typeof(Storage) == "undefined") {
    alert("Sorry, your browser does not support web storage. \nUpgrade to IE9 or contemporary platforms");
}

function sendSign(ownerAccountAddress,privateKey1,myData,gasLimit){
    web3.eth.getTransactionCount(ownerAccountAddress, (err, txCount) => {
    // Build the transaction
    const txObject = {
        nonce:    web3.utils.toHex(txCount),
        to:       contractAddress,
        value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
        gasLimit: web3.utils.toHex(gasLimit),
        gasPrice: web3.utils.toHex(web3.utils.toWei('12', 'gwei')),
        data: myData  
    }
    // Sign the transaction
    //const tx = new Tx(txObject);
    const tx = new ethereumjs.Tx(txObject);
    tx.sign(privateKey1);

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    // Broadcast the transaction
     /*const transaction = web3.eth.sendSignedTransaction(raw, (err, tx) => {
        console.log(tx)
    }); */

    const transaction = web3.eth.sendSignedTransaction(raw)
        .on('transactionHash', hash => {
            console.log('TX Hash', hash)
            alert('Transaction was send, please wait ... ')
            console.log("https://ropsten.etherscan.io/tx/"+ hash);
        })
        .then(receipt => {
            console.log('Mined', receipt)
            console.log("Your transaction was mined...")
            setTimeout(function () { location.reload(1); }, 1000);
            console.log(receipt.status)
            if(receipt.status == true ) {
                console.log('Transaction Success')
                //alert('Transaction Success')
            }
            else if(receipt.status == false) {
                console.log('Transaction Failed')
            }
        })
        .catch( err => {
            console.log('Error', err)
            //alert('Transaction Failed')
        })
        .finally(() => {
            console.log('Extra Code After Everything')
        })
    });
}


function onSignUp() {

    var bank_name1 = document.getElementById("username").value;

    //  validate input

    if (bank_name1 == "") {
        alert("Invalid bank name");
        return false;
    }
    var pass = document.getElementById("password").value;
    if (pass == "") {
        alert("Invalid password");
        return false;
    }
    var reg = document.getElementById("reg_no").value;
    if (reg == "") {
        alert("Invalid registration number");
        return false;
    }
    if (confirm("I accept that the details provided are correct.") == true) {
        //console.log(bank_name1,pass,reg)
        generate(bank_name1, pass, reg);
        //document.location.assign('./index.html');
        return false;
    }
}

async function generate(bank_name1, pass, reg) {
    let dataAcc= web3.eth.accounts.create();
    //let newPass=document.getElementById('password').value;
    /*var addBank = contractInstance.addBank.sendTransaction(bank_name1, pass, dataAcc.address, reg, { 
        from: dataAcc.Address, 
        gas: 4700000 
    }); */
    /*let addBank = await contractInstance.methods.addBank(bank_name1, pass, dataAcc.address, reg).send({
        //from: web3.eth.accounts[0],
        from: dataAcc.Address,
        gas: 4700000
    }); */
    let cek = await web3.eth.getBalance(ownerAccountAddress)
    console.log('owner', ownerPrivateKey, ownerAccountAddress, cek) 
    web3.eth.defaultAccount = dataAcc.address;
    let privKey = dataAcc.privateKey;
    console.log('bankAddress', privKey.substring(2), dataAcc.address) 
    let privateKey1 = new ethereumjs.Buffer.Buffer(ownerPrivateKey, 'hex');
    let addBank = await contractInstance.methods.addBank(bank_name1, pass, dataAcc.address, reg).encodeABI();
    //sendSign(ownerAccountAddress,privateKey1,addBank,250000);
    //console.log(addBank)
    
    web3.eth.getTransactionCount(ownerAccountAddress, (err, txCount) => {
    // Build the transaction
    const txObject = {
        nonce:    web3.utils.toHex(txCount),
        to:       contractAddress,
        value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
        gasLimit: web3.utils.toHex(250000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('12', 'gwei')),
        data: addBank  
    }
    // Sign the transaction
    //const tx = new Tx(txObject);
    const tx = new ethereumjs.Tx(txObject);
    tx.sign(privateKey1);

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    // Broadcast the transaction
     /*const transaction = web3.eth.sendSignedTransaction(raw, (err, tx) => {
        console.log(tx)
    }); */

    const transaction = web3.eth.sendSignedTransaction(raw)
        .on('transactionHash', hash => {
            console.log('TX Hash', hash)
            alert('Transaction was send, please wait ... ')
            console.log("https://ropsten.etherscan.io/tx/"+ hash);
        })
        .then(receipt => {
            console.log('Mined', receipt)
            console.log("Your transaction was mined...")
            setTimeout(function () { location.reload(1); }, 1000);
            console.log(receipt.status)
            console.log(privKey.substring(2),dataAcc.address,pass);
                
            if(receipt.status == true ) {
                console.log('Transaction Success')
                alert(bank_name1 + " successfully registered to the network. \nLogin from the \"Login\" Tab on the top-right side of the webpage.");
                encryptPrivateKey(dataAcc.privateKey,dataAcc.address,pass);
                return false;
                //alert('Transaction Success')
            }
            else if(receipt.status == false) {
                console.log('Transaction Failed')
                alert(bank_name1 + " hasn't been successfully registered to the network. \nPlease try again.");
                return false;
            }
        })
        .catch( err => {
            console.log('Error', err)
            //alert('Transaction Failed')
        })
        .finally(() => {
            console.log('Extra Code After Everything')
        })        
    });

    /*if (addBank) {
        alert(bank_name1 + " successfully registered to the network. \nLogin from the \"Login\" Tab on the top-right side of the webpage.");
        encryptPrivateKey(dataAcc.privateKey,dataAcc.address,pass);
        return false;
        //alert(bank_name1 + " has been successfully added to the network.");
        //alert("Login from the \"Login\" Tab on the top-right side of the webpage.");     
    } else {
        alert(bank_name1 + " hasn't been successfully registered to the network. \nPlease try again.");
        return false;
    }   */
}

function encryptPrivateKey(privateKey,address,pass) {
    let encryptData=web3.eth.accounts.encrypt(privateKey,pass)
    console.log("encryptData",encryptData)
    let ts = Math.round((new Date()).getTime() / 1000);
    let fileName = 'keystore_'+address+'_'+convert(ts)+'.json';
    console.log(fileName)

    let fileToSave = new Blob([JSON.stringify(encryptData)], {
        type: 'text/json',
        name: fileName
    });

    saveAs(fileToSave, fileName);
}

function convert(inputTs){
    var unixtimestamp = inputTs;
    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = new Date(unixtimestamp*1000);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    // Minutes
    var minutes = "0" + date.getMinutes();
    // Seconds
    var seconds = "0" + date.getSeconds();
    // Display date time in dd-MM-yyyy (h;m;s) format
    return  day + '-' + month + '-' + year +'_'+ hours + '-' + minutes.substr(-2) + '-' + seconds.substr(-2);
}


function onLogin() {
    var bank_name_l = document.getElementById("username_l").value;
    var pass_l = document.getElementById("password_l").value;

    //  validate input

    if (bank_name_l == "" || pass_l == "") {
        alert("Invalid bank name or password");
        return;
    } else {
        connection(bank_name_l, pass_l);
    }
}

async function connection(bank_name_l, pass_l) {
    let objKeyStore = JSON.parse(keyStoreEnc);
    //let decpassword=document.getElementById('pass_l').value;
    let decryptData=web3.eth.accounts.decrypt(objKeyStore, pass_l)
    let privateKey=decryptData.privateKey.substring(2);

    localStorage.setItem("bank_name_l",bank_name_l);
    localStorage.setItem("bankPrivKey",privateKey);
    let hexKey="0x"+privateKey;
    let acc= web3.eth.accounts.privateKeyToAccount(hexKey);
    let current_account= acc.address;
    localStorage.setItem("bankAddress",current_account);

    /*if (contractInstance.checkBank.call(bank_name_l, current_account, {
            from: ,
            gas: 4700000
        }) == true) */ 
    let checkBank = await contractInstance.methods.checkBank(bank_name_l, current_account, pass_l).call(); 
    if (checkBank == true) {
        alert("Welcome " + bank_name_l);
        document.location.assign('./resources/bankHomePage.html');
        return false;
        //localStorage.bank_eth_account = pass_l;
    } else { 
        alert("Invalid bank name, password or keystore. \nThe bank hasn't been registered yet. \nSign up before proceeding further.");
        return false;
    }
}

function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        console.log(reader.result);
        keyStoreEnc=reader.result
    };
    reader.onerror = function() {
        console.log(reader.error);
    };
}