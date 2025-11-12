
// need this
import android.util.Log
import com.facebook.common.logging.FLog
import com.facebook.common.logging.LoggingDelegate

class MainApplication : Application(), ReactApplication {

  override fun onCreate() {
    super.onCreate()

    // set this in onCreate to get full logging from React Native internals.
    FLog.setLoggingDelegate(object : LoggingDelegate {
        override fun setMinimumLoggingLevel(level: Int) {
            // Store the minimum level if needed
        }

        override fun getMinimumLoggingLevel(): Int {
            return Log.VERBOSE
        }

        override fun isLoggable(level: Int): Boolean {
            return level >= Log.VERBOSE
        }

        override fun v(tag: String, msg: String) {
            Log.v(tag, msg)
        }

        override fun v(tag: String, msg: String, tr: Throwable) {
            Log.v(tag, msg, tr)
        }

        override fun d(tag: String, msg: String) {
            Log.d(tag, msg)
        }

        override fun d(tag: String, msg: String, tr: Throwable) {
            Log.d(tag, msg, tr)
        }

        override fun i(tag: String, msg: String) {
            Log.i(tag, msg)
        }

        override fun i(tag: String, msg: String, tr: Throwable) {
            Log.i(tag, msg, tr)
        }

        override fun w(tag: String, msg: String) {
            Log.w(tag, msg)
        }

        override fun w(tag: String, msg: String, tr: Throwable) {
            Log.w(tag, msg, tr)
        }

        override fun e(tag: String, msg: String) {
            Log.e(tag, msg)
        }

        override fun e(tag: String, msg: String, tr: Throwable) {
            Log.e(tag, msg, tr)
        }

        override fun wtf(tag: String, msg: String) {
            Log.wtf(tag, msg)
        }

        override fun wtf(tag: String, msg: String, tr: Throwable) {
            Log.wtf(tag, msg, tr)
        }

        override fun log(priority: Int, tag: String, msg: String) {
            Log.println(priority, tag, msg)
        }
    })
    FLog.setMinimumLoggingLevel(FLog.VERBOSE)


  }
}
