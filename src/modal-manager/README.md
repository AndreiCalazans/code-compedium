# react-native-modal-manager

A React Native module that provides methods to manage modals in your application.

## Features

- **dismissAllModals()**: Dismisses all presented modals in the app (iOS only)

## Installation

```bash
yarn add react-native-modal-manager
```

## Usage

```javascript
import { ModalManager } from 'react-native-modal-manager';

// Dismiss all modals
ModalManager.dismissAllModals();
```

## API

### `dismissAllModals()`

Dismisses all presented modals in the app by recursively dismissing all presented view controllers.

**Platform support:**

- iOS: ✅
- Android: ❌ (No-op)

## Example

```javascript
import React from 'react';
import { Button, View } from 'react-native';
import { ModalManager } from 'react-native-modal-manager';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Dismiss All Modals"
        onPress={() => {
          ModalManager.dismissAllModals();
        }}
      />
    </View>
  );
}
```
