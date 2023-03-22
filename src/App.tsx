import { useEffect, useState } from 'react';
import { WsProvider, ApiPromise } from '@polkadot/api';
import { web3Enable } from '@polkadot/extension-dapp';
import { web3Accounts } from '@polkadot/extension-dapp/bundle';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';


const NAME = 'tenderspace';
function App() {
  const [api, setApi] = useState<ApiPromise>()
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta>();



  const setup = async () => {
    const wsprovider = new WsProvider('wss://rpc.polkadot.io')
    const api = await ApiPromise.create({ provider: wsprovider  })
    setApi(api)
  }

  const handleConnection = async() => {
    //Check if user has connection
    const extensions = await web3Enable(NAME)

    if (!extensions) {
        throw Error("NO_EXTENSION_FOUND")
    }

    const allAccounts = await web3Accounts();
    setAccounts(allAccounts)

    if (allAccounts.length === 1) {
        setSelectedAccount(allAccounts[0])
    }
  }

  const handleAccountSelection = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = e.target.value

    const account = accounts.find(account => account.address === selectedAddress)

    if(!account) {
      throw Error("ACCOUNT_NOT_FOUND")
    }

    setSelectedAccount(account)

  }

  useEffect(() => {
    setup()
  }, [])

  useEffect(() => {
    if(!api) return

    (async() => {
      const time = await api.query.timestamp.now()
      console.log(time.toPrimitive())
    })()
  }, [api])

  return (
    <div>
      {accounts.length === 0 ? (
        <button onClick={handleConnection}>CONNECT</button>
      ) : (
        <button onClick={handleConnection}>CONNECTED</button>
      )}
      {accounts.length > 0 && !selectedAccount ? (
        <>
          <select onChange={handleAccountSelection}>
            <option disabled selected hidden>Choose your account</option>
            {accounts.map((account) => (
              <option value={account.address}>{account.address}</option>
            ))}
          </select>
        </>
      ) : null}
      {selectedAccount ? selectedAccount.address : null}
    </div>
  );
}

export default App
