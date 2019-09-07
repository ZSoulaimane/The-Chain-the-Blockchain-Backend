const { GENESIS_DATA } = require('./config');
const Block = require('./block');
const cryptohash = require('./crypto-hash');

describe('Block', () => {
  const timestamp = 2000;
  const lastHash = 'foo-hash';
  const hash = 'bar-hash';
  const data = ['blockchain', 'data'];
  const block = new Block({ timestamp, lastHash, hash, data});

  it('has a timestamp, lastHash, hash, and data property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe('genesis()', () => {
    const genesisBlock = Block.genesis();

    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
  describe('mineblock() ' , () => {
    const lastblock = Block.genesis();
    const data = 'mined data' ;
    const minedBlock = Block.mineBlock({lastblock, data});

    it('reterns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('sets the lasthash to be the hash of the last block', () => {
      expect(minedBlock.lastHash).toEqual(lastblock.hash);
    });

    it('sets the data',() => {
      expect(minedBlock.data).toEqual(data);
    });

    it('it sets a timestamp', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it('creates a sha-256 hash based on the proper inputs',() =>{
      expect(minedBlock.hash).toEqual(cryptohash(minedBlock.timestamp,lastblock.hash,data));
    });
  });
});