## Amethyst Protocal SDK v2 demo page

### `yarn`
Install dependencies.

### `npm run dev` or `yarn dev`
Runs the app in development mode.
Open http://localhost:3000 to view it in the browser.

The page will automatically reload if you make changes to the code.
You will see the build errors and lint warnings in the console.

## SDK Documentation:
### Usage: 
Check Demo [LINK](./src/components/Content/Content.tsx)

Basic workflow🏊
- connect to web3 provider (Metamask)
- connect factory client to provider and signer(admin)
- create new NFT collection by defining (name, symbol and baseURI)
- interact with deployed NFT (ERC721)
  - Base 721 Interfaces
  - use admin (who created this NFT collection) to do safeMint(to, tokenId) [duplicate tokenId will be rejected by contract]

### Interfaces
#### Factory Client
```typescript
export interface AmethystFactoryClient {
    connectProvider(address: string, provider: Provider): Promise<AmethystFactoryClient>;

    connectSigner(signer: Signer): AmethystFactoryClient;

    setWaitConfirmations(num: number): void;

    /* ================ TRANSACTIONS ================ */

    /**
     * create a new AmethystNFT collection
     *
     * @param {string} name
     * @param {string} symbol
     * @param {string} baseURI
     * @param {PayableOverrides} [config]
     * @return {Promise<AmethystNFTCreatedEvent>} // 交易哈希和amethystDAO地址
     * @memberof AmethystFactoryClient
     */
    createAmethystNFT(
        name: string,
        symbol: string,
        baseURI: string,
        config?: PayableOverrides
    ): Promise<AmethystNFTCreatedEvent>;
}
export interface TransactionEvent {
    transactionHash: string;
}

/* ================ AmethystFactoryClient ================ */

export interface AmethystNFTCreatedEvent extends TransactionEvent {
    amethystNFTAddress: string;
    blockHeight: BigNumber;
    owner: string;
}
```
#### NFT Client AmethystNFT extends ERC721Client
```typescript
export interface AmethystNFTClient extends ERC721Client {
    connectProvider(address: string, provider: Provider): Promise<AmethystNFTClient>;

    connectSigner(signer: Signer): AmethystNFTClient;

    setWaitConfirmations(num: number): void;

    /**
     * owner/admin of the contract/collection
     *
     * @param {CallOverrides} [config]
     * @return {Promise<string>} owner/admin address
     */
    owner(config?: CallOverrides): Promise<string>;

    /**
     * safeMint
     *
     * @param {string} receiver address
     * @param {BigNumber} tokenId to be minted
     * @param {PayableOverrides} [config]
     * @return {Promise<string>} transaction hash
     */
    safeMint(to: string, tokenId: BigNumber, config?: PayableOverrides): Promise<string>;
}
```
```typescript
export interface ERC721Client {
    connectProvider(address: string, provider: Provider): Promise<ERC721Client>;

    connectSigner(signer: Signer): ERC721Client;

    setWaitConfirmations(num: number): void;

    /* ================ VIEWS ================ */

    /**
     * 获取账户NFT余额
     *
     * @param {string} owner NFT所有者
     * @param {CallOverrides} [config]
     * @return {Promise<BigNumber>} 返回NFT个数
     * @memberof ERC721Client
     */
    balanceOf(owner: string, config?: CallOverrides): Promise<BigNumber>;

    /**
     * 获取NFT所有者
     *
     * @param {BigNumber} tokenId NFT的tokenId
     * @param {CallOverrides} [config]
     * @return {Promise<string>} 返回所有者地址
     * @memberof ERC721Client
     */
    ownerOf(tokenId: BigNumber, config?: CallOverrides): Promise<string>;

    /**
     * 获取NFT名称
     *
     * @param {CallOverrides} [config]
     * @return {Promise<string>} 返回NFT名称
     * @memberof ERC721Client
     */
    name(config?: CallOverrides): Promise<string>;

    /**
     * 获取NFT标识符
     *
     * @param {CallOverrides} [config]
     * @return {Promise<string>} 返回NFT标识符
     * @memberof ERC721Client
     */
    symbol(config?: CallOverrides): Promise<string>;

    /**
     * 获取NFT的metadata资源的URI地址
     *
     * @param {BigNumber} tokenId NFT的tokenId
     * @param {CallOverrides} [config]
     * @return {Promise<string>} 返回URI地址
     * @memberof ERC721Client
     */
    tokenURI(tokenId: BigNumber, config?: CallOverrides): Promise<string>;

    /**
     * Total supply of the token collection
     *
     * @param {CallOverrides} [config]
     * @return {Promise<BigNumber>} return NFT total supply
     * @memberof ERC721Client
     */
    totalSupply(config?: CallOverrides): Promise<BigNumber>;

    /**
     * Token of owner by its index
     *
     * @param {string} owner address
     * @param {BigNumber} index of token by owner
     * @param {CallOverrides} [config]
     * @return {Promise<BigNumber>} tokenId
     * @memberof ERC721Client
     */
    tokenOfOwnerByIndex(owner: string, index: BigNumber, config?: CallOverrides): Promise<BigNumber>;

    /**
     * Token of collection by its index
     *
     * @param {BigNumber} index of token
     * @param {CallOverrides} [config]
     * @return {Promise<BigNumber>} tokenId
     * @memberof ERC721Client
     */
    tokenByIndex(index: BigNumber, config?: CallOverrides): Promise<BigNumber>;

    /* ================ TRANSACTIONS ================ */

    /**
     * 转移NFT
     *
     * @param {string} from 转出者地址
     * @param {string} to 转入者地址
     * @param {BigNumber} tokenId NFT的tokenId
     * @param {PayableOverrides} [config]
     * @return {Promise<TransactionEvent>} 返回交易hash
     * @memberof ERC721Client
     */
    transferFrom(from: string, to: string, tokenId: BigNumber, config?: PayableOverrides): Promise<string>;
}
```
