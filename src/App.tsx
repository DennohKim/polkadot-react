import { useEffect, useState } from 'react';
import { WsProvider, ApiPromise } from '@polkadot/api';

function App() {
  const [api, setApi] = useState<ApiPromise | null>(null)
  const setup = async () => {
    const wsprovider = new WsProvider('wss://rpc.polkadot.io')
    const api = await ApiPromise.create({ provider: wsprovider  })
    setApi(api)
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
    <div className="App">
      
    </div>
  )
}

export default App
