const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let inbox;

beforeEach( async () => {
    // get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // use one of those account to deploy
    // the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send({ from: accounts[0], gas: '1000000' });

    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('default message correct', async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, 'Hi there!');
    });

    it('set message success', async () => {
        const newMessage = 'hello~~~';
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });

        const message = await inbox.methods.message().call();
        assert.strictEqual(message, newMessage);
    });
});