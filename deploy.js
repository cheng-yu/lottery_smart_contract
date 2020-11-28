const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const { mnemonic } = require('./keys');

const provider = new HDWalletProvider(
    mnemonic,
    'https://rinkeby.infura.io/v3/a58c9a4c73274f8882aff762556c824f'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    // use one of those account to deploy
    // the contract
    let result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send({ from: accounts[0], gas: '1000000' });

    console.log('Contract deployed to', result.options.address);
};

deploy();