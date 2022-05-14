import { Chain, Peer, Status} from "./blockchain";

const Satici = new Peer();
const Alici = new Peer();
const Kargo = new Peer();

Satici.makeTransaction(Status.SatisOncesi, "1", Alici.publicKey);
Satici.makeTransaction(Status.Hazirlanma, "1", Alici.publicKey);
Kargo.makeTransaction(Status.KargoCikis, "1", Alici.publicKey);
Kargo.makeTransaction(Status.Dagitim, "1", Alici.publicKey);
Kargo.makeTransaction(Status.Teslim, "1", Alici.publicKey);

console.log(Chain.instance)
