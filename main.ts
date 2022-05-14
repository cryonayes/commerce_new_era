import { Chain, Peer, Status} from "./blockchain";
import express = require('express');
import path = require("path/posix");

var app: express.Server = express();

const Manifacturer = new Peer();
Manifacturer.makeTransaction(Status.Orijinal, "123", Manifacturer.publicKey, 'Turkey', Date.now());

app.listen(3000, () => { console.log('Server started on port 3000'); });

app.get('/', (_req, res: express.Response) => {
		res.sendFile(path.join(__dirname, '../html', 'index.html'));
	}
);

app.get('/ShowBlocks', (_req, res: express.Response) => {
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify(Chain.instance.chain, null, 4));
	}
);

app.get('/AddToChain', (req, res: express.Response) => {
		let itemId = req.query.itemId;
		let madeIn = req.query.madeIn;
		let madeAt = req.query.madeAt;
		let status = req.query.status;
		Manifacturer.makeTransaction(status, itemId, Manifacturer.publicKey, madeIn, madeAt);
		res.redirect('/');
	}
);
