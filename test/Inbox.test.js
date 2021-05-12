const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!'

beforeEach(async () => {
    // get a list of all accounts
    accounts = await web3.eth.getAccounts();
    
    // use one of thsoe accounts to deploy
    // the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] }) // data (contract), constructor arguments
    .send({ from: accounts[0], gas: '1000000' }) // account deploying from, gas that can be used
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });
    
    it('has a default message', async () => { // constructor test
        // call message() method made by `string public message;` in contract
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });
    
    it('can change the message', async () => { // modify that test
       await inbox.methods.setMessage('bye').send({ from: accounts[0] });
       const message = await inbox.methods.message().call();
       assert.equal(message, 'bye');
    });
});
