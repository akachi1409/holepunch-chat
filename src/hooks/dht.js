import { useEffect, useState } from 'react'
import DHT from '@hyperswarm/dht-relay'
import Stream from '@hyperswarm/dht-relay/ws'

// + probably a global WebSocket instance?

export default function useDHT () {
  const [dht, setDHT] = useState(null)

  useEffect(() => {
    const ws = new WebSocket('wss://dht2-relay.leet.ar')
    const dht = new DHT(new Stream(true, ws))

    setDHT(dht)

    return () => {
      // console.log('hook dht cleanup')
      dht.destroy()
    }
  }, [])

  return [dht]
}
