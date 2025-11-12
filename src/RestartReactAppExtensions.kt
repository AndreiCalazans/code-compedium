
package expo.modules.updates.procedures

import android.util.Log
import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.view.View
import com.facebook.react.ReactActivity
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceEventListener
import com.facebook.react.ReactRootView
import com.facebook.react.bridge.ReactContext
import com.facebook.react.common.LifecycleState
import expo.modules.rncompatibility.ReactNativeFeatureFlags


/**
 * An extension for [ReactApplication] to restart the app
 *
 * @param activity For bridgeless mode if the ReactHost is destroyed, we need an Activity to resume it.
 * @param reason The restart reason. Only used on bridgeless mode.
 */
internal fun ReactApplication.restart(activity: Activity?, reason: String) {
  if (ReactNativeFeatureFlags.enableBridgelessArchitecture) {
    val reactHost = this.reactHost
    check(reactHost != null)
    if (reactHost.lifecycleState != LifecycleState.RESUMED && activity != null) {
      reactHost.onHostResume(activity)
    }
    reactHost.reload(reason)
    return
  }

  // Fix for Android UI freeze during OTA updates for the old architecture
  // on React Native 0.79.5
  // We need to properly detach the ReactRootView, recreate the context, and re-attach
  if (activity is ReactActivity) {
    try {
      Log.d("ANDREI", "clean up?")
      val reactDelegate = activity.reactDelegate
      val reactRootView = reactDelegate?.reactRootView

      if (reactRootView != null) {
        val reactInstanceManager = reactNativeHost.reactInstanceManager

        // 1. Unmount the root view to stop JS from rendering
        reactInstanceManager.detachRootView(reactRootView)

        // 2. Clear the view hierarchy and ID
        reactRootView.removeAllViews()
        reactRootView.id = View.NO_ID

        // 3. Add a one-time listener to re-attach the view after the new context is ready
        val listener = object : ReactInstanceEventListener {
          override fun onReactContextInitialized(context: ReactContext) {
            Handler(Looper.getMainLooper()).post {
              // Re-attach the root view to the new React instance
              reactInstanceManager.attachRootView(reactRootView)

              Log.d("ANDREI", "Reattach?")
              // Remove this one-time listener
              reactInstanceManager.removeReactInstanceEventListener(this)
            }
          }
        }
        reactInstanceManager.addReactInstanceEventListener(listener)

        // 4. Post to UI thread with delay to ensure cleanup completes
        Handler(Looper.getMainLooper()).postDelayed({
          // Now recreate the React context - the listener will re-attach the view
          reactInstanceManager.recreateReactContextInBackground()
        }, 100)

        return
      }
    } catch (e: Exception) {
      Log.e("ANDREI", "Error during ReactRootView cleanup", e)
      // If cleanup fails, try the standard approach as fallback
    }
  }

  // Fallback: standard recreation without cleanup
  reactNativeHost.reactInstanceManager.recreateReactContextInBackground()
}
