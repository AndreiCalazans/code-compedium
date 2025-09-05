This is how i run release profiler bfore all the app code to catch both the cost
of module initialization plus the cost of rendering.
```typescript
/* istanbul ignore file */

import { startProfiling } from 'react-native-release-profiler';

startProfiling();

import React, { Suspense, useState } from 'react';

import { AppRegistry, View, Button } from 'react-native';

const LazyRoot = React.lazy(() => import('./src/App.tsx'));

function Main() {
  const [shouldLoad, setShouldLoad] = useState(false);

  if (shouldLoad) {
    return (
      <View style={{ flex: 1 }}>
        <Suspense
          fallback={
            <View style={{ backgroundCoor: 'red', width: 100, height: 100 }} />
          }
        >
          <LazyRoot />
        </Suspense>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        title="Load me"
        onPress={() => {
          setShouldLoad(true);
          setTimeout(() => {
            stopProfiling(true);
          }, 15000);
        }}
      />
    </View>
  );
}

AppRegistry.registerComponent('main', () => Main);
```
