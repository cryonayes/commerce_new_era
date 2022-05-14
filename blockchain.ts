import * as crypto from 'crypto';

export enum Status
{
	Orijinal = "Orijinal",
	Replika = "Replika",
	IkinciEl = "Ikinci El"
}

export class ItemInfo
{
	constructor(
		public signerPublicKey: string,
		public itemID: string,
		public status: Status,
		public madeIn: string,
		public madeBy: string,
		public madeAt: number,
		public TESF: number
	){}

	public toString(): string { return JSON.stringify(this); }
}

export class Block
{
	public nonce = Math.round(Math.random() * 4203141592);

	constructor(public prevHash: string, public itemInfo: ItemInfo, public ts = Date.now())
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
	public chain: Block[];

	constructor()
	{
		this.chain = [
			new Block('', new ItemInfo('NULL', 'NULL', Status.Orijinal, '42Kocaeli', 'NULL', Date.now(), 0))
		];
	}

	public findBlockByItemID(itemID: string): Block
	{
		for (let i = 0; i < this.chain.length; i++)
		{
			if (this.chain[i].itemInfo.itemID === itemID)
				return this.chain[i];
		}
		return null;
	}

	mine(nonce: number): number
	{
		let solution: number = 0;
		
		while(true)
		{
			const hash = crypto.createHash('MD5');
			hash.update((nonce + solution).toString()).end();
			const attempt = hash.digest('hex');
		  
			if(attempt.substring(0,2) === '00')
				return solution;
			solution += 1;
		}
	}

	addBlock(transaction: ItemInfo, signerPublicKey: string, signature: Buffer)
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

	makeTransaction(status: Status, itemID: string, signerPublicKey: string, madeIn: string, madeBy: string, madeAt: number, TESF: number)
	{
		const transaction = new ItemInfo(signerPublicKey, itemID, status, madeIn, madeBy, madeAt, TESF);
		const sign = crypto.createSign('SHA256');
		sign.update(transaction.toString()).end();
		const signature = sign.sign(this.privateKey); 
		Chain.instance.addBlock(transaction, this.publicKey, signature);
	}
}
