const Blockchain =require('./blockchain');
const block = require('./block');

describe ('blockchain',() => {
    let blockchain,newchain,originalchain ;

    beforeEach(()=>{
        blockchain = new Blockchain();
        originalchain=blockchain.chain;
        newchain = new Blockchain();
    });

    it('contain a chain array instance',() =>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with genesis block',() =>{
        expect(blockchain.chain[0]).toEqual(block.genesis());
    });

    it('add a new block to the chain',() =>{
        const newData='foo bar';
        blockchain.addBlock({data : newData});

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isvalidchain',()=>{
        describe('when the chain does not start with genesis block',() =>{
            it('return false',()=>{
                blockchain.chain[0] = {data : 'fake-genesis'};

                expect(Blockchain.isvalidchain(blockchain.chain)).toBe(false)
            });
        });
        describe('when the chain starts with genesis block and has multiple blocks',()=>{
            beforeEach(()=>{
                blockchain.addBlock({data : 'bears'});
                blockchain.addBlock({data : 'beets'});
                blockchain.addBlock({data : 'bulls'});
            });
            describe('and a last hash reference has changed',()=>{
                it('returns false',()=>{

                    blockchain.chain[2].lastHash = 'broken-lasthash';

                    expect(Blockchain.isvalidchain(blockchain.chain)).toBe(false)
                });
            });

            describe('and the chain contains a block with an invalid field',()=>{
                it('return false ',()=>{

                    blockchain.chain[2].data = 'bad*data';

                    expect(Blockchain.isvalidchain(blockchain.chain)).toBe(false)
                });
            });

            describe('and the chain does not contain an invalid blocks',()=>{
                it('returns true',()=>{
                    expect(Blockchain.isvalidchain(blockchain.chain)).toBe(true)
                });
            });
        });
    });

    describe('replacechain()',()=>{
        let errorMock, logMock;

        beforeEach(()=>{
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.errorMock = errorMock;
            global.console.log = logMock;
        });

        describe('when new chain is not longer',()=>{
            beforeEach(()=>{
                newchain.chain[0] = {new: 'chain' };

                blockchain.replacechain(newchain.chain);
            });

            it('does not replace the chain',()=>{

                expect(blockchain.chain).toEqual(originalchain);

            });
 
        });

        describe('when the new chain is longer',()=>{
            beforeEach(()=>{
                newchain.addBlock({data : 'bears'});
                newchain.addBlock({data : 'beets'});
                newchain.addBlock({data : 'bulls'});
            });
            describe('and the chain is invalid',()=>{
                beforeEach(()=>{
                    newchain.chain[2].hash = 'some-fake-hash';

                    blockchain.replacechain(newchain.chain);
                });
                it('does not replace the chain',()=>{

                    expect(blockchain.chain).toEqual(originalchain);
                }); 
            });

            describe('and the chain is valid',()=>{
                beforeEach(()=>{
                    blockchain.replacechain(newchain.chain);
                });
                it('replaces the chain',()=>{

                    expect(blockchain.chain).toEqual(newchain.chain);

                });
            });
        });
    });
});