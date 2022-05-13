import { Transaction, Block, Status } from "./blockchain";

console.log(new Block(new Transaction("1", "2", "0", Status.SatisOncesi), "0"));
