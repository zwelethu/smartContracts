const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async ()=>{
	//get a list of all accounts
	accounts = await web3.eth.getAccounts();
	//use of those to deploy the contract
	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({data: bytecode, arguments: ['Testing!']})
		.send({from: accounts[1], gas: '1000000'})
});

describe('Inbox', () =>{
	it('deploys a contract', ()=>{
		assert.ok(inbox.options.address);
	});
	it('Has default message', async () => {
		const message = await inbox.methods.message().call();
		assert.equal(message, 'Testing!');
	});

	it('Can change message', async () => {
		await inbox.methods.setMessage('New message').send({
			from: accounts[1]
		});
		const message = await inbox.methods.message().call();
		assert.equal(message, 'New message');
	});

});
