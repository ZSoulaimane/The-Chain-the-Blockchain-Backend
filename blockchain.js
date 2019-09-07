const Block=require('./block')
const cryptohash = require('./crypto-hash');

class Blockchain{
    constructor(){
        this.chain=[] = [Block.genesis()];
    }

    addBlock({ data }) {
        const newblock = Block.mineBlock({
            lastblock:this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newblock);
    }
    static isvalidchain(chain){

        if(JSON.stringify(chain[0])!==JSON.stringify(Block.genesis())) {return false};

        for(let i=1;i<chain.length; i++){

            const { timestamp, lastHash,hash ,data} = chain[i];

            const actuallasthash = chain[i-1].hash;

            if(lastHash !== actuallasthash) return false;

            const validatedhash = cryptohash( timestamp,lastHash , data);

            if(hash !== validatedhash) return false;
        }
        return true;
    }
    replacechain (chain){
        if(chain.length <= this.chain.length){
            console.error('the incoming chain must be longer');
            return ;
        }

        if(!Blockchain.isvalidchain(chain)){
            console.error('the incoming chain must valid');
            return;
        }

        console.log('replacing chain with',chain);
        this.chain = chain;

    }

}

module.exports=Blockchain;