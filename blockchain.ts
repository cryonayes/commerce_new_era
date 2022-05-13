import * as crypto from 'crypto';

// Yapılan işlemlerin durumunu belirlemek için enum sınıfı.  
export enum Status {
	SatisOncesi = "Satış Öncesi",
	Hazirlanma = "Hazırlanma",
	KargoCikis = "Kargo Çıkış",
	Dagitim = "Dağıtım",
	Teslim = "Teslim",
	Iade = "İade"
}

// Yapılan işlemlerin tutulduğu bilgi sınıfı.
export class Transaction
{
	constructor(
		public customerID: string, 
		public signerID: string,
		public itemID: string,
		public status: Status
	){}

	public toString(): string { return JSON.stringify(this); }
}

export class Block
{
	public nonce = Math.round(Math.random() * 420314159265);
	constructor(public transaction: Transaction, public previousHash: string, public timeStamp: number = Date.now())
	{}
	
	get hash(): string 
	{
		const block2Str = JSON.stringify(this);
		const hash = crypto.createHash('sha256');
		hash.update(block2Str);
		return hash.digest('hex');
	}
}

export class Chain
{
	public static instance = new Chain();
	private blocks: Block[] = [];
	
	constructor()
	{
		this.blocks = [
			new Block(new Transaction("genesis", "NULL", "NULL", Status.Teslim), "NULL")
		]
	}

	get latestBlock(): Block { return this.blocks[this.blocks.length - 1]; }

	public addBlock(): void
	{
		// Gerekli kontrollerin ardından block zincire eklenecek..
	}
}

export class Peer
{
	public publicKey: string;
	public secretKey: string;

	constructor()
	{
		const keypair = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: { type: 'spki', format: 'pem' },
			privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
		});
		this.publicKey = keypair.publicKey;
		this.secretKey = keypair.privateKey;
	}

	makeTransaction(customerID: string, targetPublicKey: string)
	{
		// TODO(Yapılan işlemin sign edilmesi ve blokzincire eklenmesi implemente edilecek)
	}
}
