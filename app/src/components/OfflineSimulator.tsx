import React, { useEffect, useState } from 'react'
import { Separator, YGroup, XStack, H6 } from 'tamagui'
import { onlineManager } from '@tanstack/react-query'

import { SwitchWithLabel } from './SwitchWithLabel'

const OfflineSimulator = () => {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline())

  const handleCheckChange = () => {
    setIsOnline(!isOnline)
  }

  useEffect(() => {
    onlineManager.setOnline(isOnline)
  }, [isOnline])

  return (
    <XStack $sm={{ flexDirection: 'column' }} px='$5' mt='$10' space>
      <XStack justifyContent='space-between'>
        <H6 fontWeight='$2' size='$5'>
          Experimental Features
        </H6>
      </XStack>
      <XStack>
        <YGroup width='100%' separator={<Separator />}>
          <YGroup.Item>
            <SwitchWithLabel
              size={'$3'}
              label='Online'
              checked={isOnline}
              onCheckChange={handleCheckChange}
            />
          </YGroup.Item>
        </YGroup>
      </XStack>
    </XStack>

    /* <View style={styles.container}> */
    /*   <View style={styles.buttons}> */
    /*     <Button */
    /*       title='Online' */
    /*       onPress={() => { */
    /*         onlineManager.setOnline(true) */
    /*         setIsOnline(onlineManager.isOnline()) */
    /*       }} */
    /*     /> */
    /*     <Button */
    /*       title='Offline' */
    /*       onPress={() => { */
    /*         onlineManager.setOnline(false) */
    /*         setIsOnline(onlineManager.isOnline()) */
    /*       }} */
    /*     /> */
    /*   </View> */
    /*   <Text> */
    /*     Status is:{' '} */
    /*     <Text style={styles.status}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text> */
    /*   </Text> */
    /* </View> */
  )
}

export default OfflineSimulator
