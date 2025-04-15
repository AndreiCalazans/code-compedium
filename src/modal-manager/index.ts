import { requireOptionalNativeModule } from 'expo-modules-core';

type CBModalManagerType = {
  dismissAllModals: () => void;
};

const CBModalManagerModule = requireOptionalNativeModule<CBModalManagerType>('CBModalManager');

/**
 * A module that provides methods to manage modals in your React Native application.
 */
export const ModalManager = {
  /**
   * Dismisses all presented modals in the app.
   * This is an iOS-only method. On Android, this is a no-op.
   *
   * This method recursively dismisses all presented modals by getting the rootViewController
   * and traversing through all presented view controllers.
   *
   * @platform ios
   */
  dismissAllModals: (): void => {
    if (!CBModalManagerModule) {
      // No-op if the module is not available (e.g., on Android)
      return;
    }
    CBModalManagerModule.dismissAllModals();
  },
};
