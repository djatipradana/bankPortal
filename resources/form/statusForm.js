//  Web3 intializer
//  ABI definition, Binary Data and contract Address in contractDetails.js
//const Web3 = require('web3');
//const Tx = require('ethereumjs-tx'); 

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/6a68c430ab2e43adb0762c4cfa9bbb42"));
/*var kycContract = web3.eth.contract(abi);
var deployedContract = kycContract.new({
    data: binaryData,
    from: web3.eth.accounts[0],
    gas: 4700000
});
var contractInstance = kycContract.at(contractAddress); */

const contractInstance = new web3.eth.Contract(abi, contractAddress);

//  account to make all transactions
var current_bankPriveKey;
var current_bankAddress;
var current_bank_name_l;

//var current_account = localStorage.bank_eth_account;
//var user_name = localStorage.user_name_m;

window.onload = function() {
    current_bankPriveKey = localStorage.getItem("bankPrivKey");
    current_bankAddress = localStorage.getItem("bankAddress");
    current_bank_name_l = localStorage.getItem("bank_name_l");

    table();

    //document.getElementById("uname").innerHTML = current_username;
    //document.getElementById("bank_name").innerHTML = current_bankName;
}


async function table() {
    let filling = await contractInstance.methods.fillTable(current_bank_name_l).call(); 
    console.log(filling);
    if (filling.length < 1) {
        alert("Customer data doesn't exist.");
        document.location.assign('../bankHomePage.html');
        return false;
    } else {
        //let userReq = [];
        //userReq.push(...filling);
        //userReq = [...filling];
        for (let i = 0; i < filling.length; i++) {
            let getCustStatus = await contractInstance.methods.getCustStatus(filling[i]).call();
            var table = document.getElementById("table_status");
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            //var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = filling[i];
            cell2.innerHTML = getCustStatus;   
        }
    }
}
