import Head from "next/head"
import styles from "../styles/Home.module.css"
import { useState, useEffect, useRef } from "react"
import { providers } from "ethers"
import Web3Modal from "web3modal"


export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const web3ModalRef = useRef()
  const [ENS, setENS] = useState("")
  const [address, setAddress] = useState("")

  const setENSOrAddress = async (_address, _web3Provider) => {
    try {
      var _ens = await _web3Provider.lookupAddress(_address)

      if(_ens) {
        setENS(_ens)
      } else {
        setAddress(_address)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const { chainId } = await web3Provider.getNetwork()
    if(chainId != 4) {
      window.alert("Please connect to the rinkeby network")
      throw new Error("Please connect to the rinkeby network")
    }

    const signer = await web3Provider.getSigner()
    const address = await signer.getAddress()

    await setENSOrAddress(address, web3Provider)
    return signer
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
      })
      connectWallet()
    }
  }, [walletConnected])

  const renderButton = () => {
    if(walletConnected) {
      <div className={styles.description}>Wallet Connected</div>
    } else {
      return(
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      )
    }
  }

  return(
    <div>
      <Head>
        <title>ENS Tutorial</title>
        <meta name="descritption" content="ENS dApp"/>
        <link rel="icon" href="./favicon.ico"/>
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks: 
            {ENS ? ENS : address}
          </h1>
          <div className={styles.description}>
            This is an NFT collection for LearnWeb3 Punks!
          </div>
          {renderButton()}
        </div>

        <div>
          <img src="./learnweb3punks.png" className={styles.imgae} />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; for LearnWeb3 Punks!
      </footer>
    </div>
  )
}