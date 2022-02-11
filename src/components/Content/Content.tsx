/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EtherAmethystFactoryClient,
  EthersAmethystNFTClient
} from '@white-matrix/amethyst-protocol-v2-sdk';
import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Content.module.less';

export function Content() {
  // const FACTORY_CONTRACT_ADDRESS = '0x9f1e78C90A070D35bd6f9a0587ddeF72cf1fE6B7';
  const FACTORY_CONTRACT_ADDRESS = '0xfFe1AcADbcAb307DDA12adb9aF210A37B296139A';
  const ethProvider = useRef<ethers.providers.Web3Provider>();
  const factoryClient = useRef<EtherAmethystFactoryClient>();
  const nftClient = useRef<EthersAmethystNFTClient>();
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [factoryAddress, setFactoryAddress] = useState<string>('');
  const [newNFTName, setNewNFTName] = useState<string>('');
  const [newNFTSymbol, setNewNFTSymbol] = useState<string>('');
  const [newNFTBaseURI, setNewNFTBaseURI] = useState<string>('');
  const [shareHolderList, setShareHolderList] = useState<string[]>([]);
  const [shares, setShares] = useState<number[]>([]);

  const [lastCreatedNFTAddress, setLastCreatedNFTAddress] =
      useState<string>('');

  const [nftSymbol, setNFTSymbol] = useState<string>('');
  const [nftOwner, setNFTOwner] = useState<string>('');
  const [nftName, setNFTName] = useState<string>('');
  const [nftTotalSupply, setNFTTotalSupply] = useState<string>('');

  const [mintTo, setMintTo] = useState<string>('');
  const [mintTokenId, setMintTokenId] = useState<string>('');
  const [tokenIdToCheck, setTokenIdToCheck] = useState<string>('');
  const [nftTokenURI, setNFTTokenURI] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [tokenPrice, setTokenPrice] = useState<string>('');
  const [tokenSignature, setTokenSignature] = useState<string>('');
  const [claimTokenSignature, setClaimTokenSignature] = useState<string>('');
  const [claimAddress, setClaimAddress] = useState<string>('');
  const [claimTokenPrice, setClaimTokenPrice] = useState<string>('');
  const [claimTokenId, setClaimTokenId] = useState<string>('');

  const [toBalance, setToBalance] = useState<string>('');

  useEffect(() => {
    void initProvider();
  }, []);

  async function initProvider() {
    ethProvider.current = new ethers.providers.Web3Provider(window.ethereum);
    factoryClient.current = new EtherAmethystFactoryClient();
    await ethProvider.current.send('eth_requestAccounts', []);
    const signer = ethProvider.current.getSigner();
    (window.ethereum as any).on('accountsChanged', function (accounts: any[]) {
      setConnectedAddress(accounts[0]);
    });
    setConnectedAddress(await signer.getAddress());
    await factoryClient.current.connectProvider(
        FACTORY_CONTRACT_ADDRESS,
        ethProvider.current
    );
    factoryClient.current.connectSigner(signer);
    factoryClient.current.setWaitConfirmations(1); // testnet

    nftClient.current = new EthersAmethystNFTClient();
  }

  const refreshView = async () => {
    const address = await ethProvider.current?.getSigner().getAddress();
    if (address) {
      setConnectedAddress(address);
    }
    const factoryAddress = factoryClient.current?.amethystFactory?.address;
    if (factoryAddress) {
      setFactoryAddress(factoryAddress);
    }
  };

  const refreshLastCreatedNFTView = async () => {
    if (ethProvider.current && nftClient.current && lastCreatedNFTAddress) {
      try {
        await nftClient.current.connectProvider(
            lastCreatedNFTAddress,
            ethProvider.current
        );
        nftClient.current.setWaitConfirmations(1); // testnet
        setNFTName(await nftClient.current.name());
        setNFTSymbol(await nftClient.current.symbol());
        setNFTOwner(await nftClient.current.owner());
        setNFTTotalSupply((await nftClient.current.totalSupply()).toString());
        if (mintTo !== '') {
          setToBalance((await nftClient.current.balanceOf(mintTo)).toString());
        }
        if (tokenIdToCheck !== '') {
          setNFTTokenURI(
              await nftClient.current.tokenURI(BigNumber.from(tokenIdToCheck))
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const createNFT = async () => {
    try {
      if (factoryClient.current && ethProvider.current) {
        console.log('start creating NFT');
        const nft = await factoryClient.current.createAmethystNFT(
            newNFTName,
            newNFTSymbol,
            newNFTBaseURI,
            shareHolderList,
            shares
        );
        console.log('finish');
        console.log(nft);
        setLastCreatedNFTAddress(nft.amethystNFTAddress);
        await refreshLastCreatedNFTView();
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const mintNFT = async () => {
    try {
      if (nftClient.current && ethProvider.current) {
        nftClient.current.connectSigner(ethProvider.current.getSigner());
        console.log('start minting NFT');
        const tx = await nftClient.current.safeMint(
            mintTo,
            BigNumber.from(mintTokenId)
        );
        console.log('finish');
        console.log(tx);
        await refreshLastCreatedNFTView();
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const signTokenInfo = async () => {
    try {
      if (nftClient.current && ethProvider.current) {
        nftClient.current.connectSigner(ethProvider.current.getSigner());
        console.log('start sign token info');
        const signature = await nftClient.current.signClaimMessage(
            4, // for rinkeby
            Number(tokenId),
            Number(tokenPrice)
        );
        console.log('finish');
        console.log(signature);
        setTokenSignature(signature);
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const claim = async () => {
    try {
      if (nftClient.current && ethProvider.current) {
        await nftClient.current.connectProvider(
            lastCreatedNFTAddress,
            ethProvider.current
        );
        nftClient.current.setWaitConfirmations(1); // testnet
        nftClient.current.connectSigner(ethProvider.current.getSigner());
        console.log('start claiming NFT');
        const tx = await nftClient.current.claim(
            claimAddress,
            BigNumber.from(claimTokenId),
            BigNumber.from(claimTokenPrice),
            claimTokenSignature,
            { value: BigNumber.from(claimTokenPrice) }
        );
        console.log('finish');
        console.log(tx);
        await refreshLastCreatedNFTView();
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
      <div>
        <div className={styles.item}>
          <button onClick={refreshView}>Refresh View</button>
        </div>
        <div className={styles.item}>
          <p>
            current connected address:{' '}
            {connectedAddress || 'not connected or refresh to check'}
          </p>
        </div>

        <h2>
          Factory Interaction (nft creator will be the owner/admin of new nft
          collection)
        </h2>
        <div className={styles.item}>
          <p>current Factory address: {factoryAddress || 'refresh to check'}</p>
        </div>
        <div className={styles.item}>
          NFT Name:
          <input
              onChange={(e) => setNewNFTName(e.target.value)}
              placeholder="NFT Name"
          />
          NFT Symbol:
          <input
              onChange={(e) => setNewNFTSymbol(e.target.value)}
              placeholder="NFT Symbol"
          />
          NFT BaseURI:
          <input
              onChange={(e) => setNewNFTBaseURI(e.target.value)}
              placeholder="NFT BaseURI"
          />
          NFT ShareHolderList:
          <input
              onChange={(e) => setShareHolderList(e.target.value.split(','))}
              placeholder="NFT ShareHolderList"
          />
          NFT Shares:
          <input
              onChange={(e) =>
                  setShares(e.target.value.split(',').map((item) => Number(item)))
              }
              placeholder="NFT Shares"
          />
          ,<button onClick={createNFT}>Create new AmethystNFT</button>
        </div>
        <h2>Last Created NFT Interaction</h2>
        <div className={styles.item}>
          <p>
            Last created NFT address:{' '}
            {lastCreatedNFTAddress || 'null or refresh to check'}
          </p>
        </div>
        <div className={styles.item}>
          <button onClick={refreshLastCreatedNFTView}>
            Refresh Last created NFT View
          </button>
        </div>
        <div className={styles.item}>
          <p>NFT Name: {nftName || 'null or refresh to check'}</p>
          <p>NFT Symbol: {nftSymbol || 'null or refresh to check'}</p>
          <p>NFT Owner: {nftOwner || 'null or refresh to check'}</p>
          <p>NFT TotalSupply: {nftTotalSupply || 'null or refresh to check'}</p>
          <p>Current MinTo : {mintTo || 'null or refresh to check'}</p>
        </div>
        <h4>Mint (admin/owner) </h4>
        <div className={styles.item}>
          Mint to (address):
          <input
              onChange={(e) => setMintTo(e.target.value)}
              placeholder="MintTo"
          />{' '}
          , Mint tokenId (number) duplicate will be rejected:
          <input
              onChange={(e) => setMintTokenId(e.target.value)}
              placeholder="TokenId"
          />
          ,<button onClick={mintNFT}>mint</button>
          <p>MinTo Current Balance : {toBalance || 'null or refresh to check'}</p>
        </div>
        <div className={styles.item}>
          Token to check:
          <input
              onChange={(e) => setTokenIdToCheck(e.target.value)}
              placeholder="TokenId"
          />
          <p>TokenURI: {nftTokenURI || 'null or refresh to check'}</p>
        </div>

        <h4>Signature (admin/owner) </h4>
        <div className={styles.item}>
          Set Token Price (int):
          <input
              onChange={(e) => setTokenPrice(e.target.value)}
              placeholder="TokenPrice"
          />{' '}
          , Set Token Id (int)::
          <input
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="TokenId"
          />
          ,<button onClick={signTokenInfo}>signature</button>
          <p>Token Signature : {tokenSignature || 'null or refresh to check'}</p>
        </div>

        <h4>Claim </h4>
        <div className={styles.item}>
          Set Address (address):
          <input
              onChange={(e) => setClaimAddress(e.target.value)}
              placeholder="Claim to"
          />{' '}
          ,Set Token Signature:
          <input
              onChange={(e) => setClaimTokenSignature(e.target.value)}
              placeholder="TokenSignature"
          />{' '}
          ,Set Token Price (int):
          <input
              onChange={(e) => setClaimTokenPrice(e.target.value)}
              placeholder="TokenPrice"
          />{' '}
          , Set Token Id (int)::
          <input
              onChange={(e) => setClaimTokenId(e.target.value)}
              placeholder="TokenId"
          />
          ,<button onClick={claim}>claim</button>
        </div>
      </div>
  );
}
