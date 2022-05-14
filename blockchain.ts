import * as crypto from 'crypto';

export enum Status
{
	SatisOncesi = "Satış Öncesi",
	Hazirlanma = "Hazırlanma",
	KargoCikis = "Kargo Çıkış",
	Dagitim = "Dağıtım",
	Teslim = "Teslim",
	Iade = "İade"
}

export class Transaction
{
	constructor(public customerKey: string, public signerPublicKey: string, public itemID: string, public status: Status)
	{}

	public toString(): string { return JSON.stringify(this); }
}

export class Block
{
	public nonce = Math.round(Math.random() * 4203141592);

	constructor(public prevHash: string, public transaction: Transaction, public ts = Date.now())
	{}

	get hash()
	{
		const block2Str = JSON.stringify(this);
		const hash = crypto.createHash('SHA256');
		hash.update(block2Str).end();
		return hash.digest('hex');
	}
}

export class Chain
{
	public static instance = new Chain();

	private chain: Block[];

	constructor()
	{
		this.chain = [
			new Block('', new Transaction('genesis', 'NULL', 'NULL', Status.Teslim))
		];
	}

	mine(nonce: number): number
	{
		let solution: number = 0;
		
		while(true)
		{
			const hash = crypto.createHash('MD5');
			hash.update((nonce + solution).toString()).end();
			const attempt = hash.digest('hex');
		  
			if(attempt.substring(0,4) === '0000')
				return solution;
			solution += 1;
		}
	}

	addBlock(transaction: Transaction, signerPublicKey: string, signature: Buffer)
	{
		const verify = crypto.createVerify('SHA256');
		verify.update(transaction.toString());

		const isValid = verify.verify(signerPublicKey, signature);
		if (!isValid)
			return;
		const newBlock = new Block(this.latestBlock.hash, transaction);
		this.mine(newBlock.nonce);
		this.chain.push(newBlock);
	}

	get latestBlock() { return this.chain[this.chain.length - 1]; }
}

export class Peer
{
	public publicKey: string;
	public privateKey: string;

	constructor()
	{
		const keypair = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: { type: 'spki', format: 'pem' },
			privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
		});
		this.privateKey = keypair.privateKey;
		this.publicKey = keypair.publicKey;
	}

	makeTransaction(status: Status, itemID: string, signerPublicKey: string)
	{
		const transaction = new Transaction(this.publicKey, signerPublicKey, itemID,status);
		const sign = crypto.createSign('SHA256');
		sign.update(transaction.toString()).end();
		const signature = sign.sign(this.privateKey); 
		Chain.instance.addBlock(transaction, this.publicKey, signature);
	}
}
