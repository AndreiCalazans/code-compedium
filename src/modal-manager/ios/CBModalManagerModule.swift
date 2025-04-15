import ExpoModulesCore
import UIKit

public class CBModalManagerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("CBModalManager")
    
    Function("dismissAllModals") {
      self.dismissAllModals()
    }
  }
  
  private func dismissAllModals() {
    DispatchQueue.main.async {
      // Guard against missing root view controller
      guard let rootVC = UIApplication.shared.delegate?.window??.rootViewController else {
        print("CBModalManager: Could not find root view controller")
        return
      }
      
      // Find modals and dismiss from top-most (last presented) to root
      var currentVC = rootVC
      while let presentedVC = currentVC.presentedViewController {
        currentVC = presentedVC
      }
      
      // Now currentVC is the top-most presented controller
      // Work our way back to root, dismissing each modal
      while currentVC != rootVC && currentVC.presentingViewController != nil {
        // Get parent before dismissing
        guard let presentingVC = currentVC.presentingViewController else {
          print("CBModalManager: Unexpected nil presenting view controller")
          break
        }

        // Check that it's a RN modal and that it responds to the dismiss selector
        let isRNModal = NSStringFromClass(type(of: currentVC)).contains("RCTModalHostViewController")
        let dismissSelector = Selector("presentationControllerDidAttemptToDismiss:")
        
        if isRNModal, 
           let delegate = currentVC.presentationController?.delegate,
           delegate.responds(to: dismissSelector) {
          // Trigger the internal callback so JS state updates
          delegate.perform(
            dismissSelector,
            with: currentVC.presentationController
          )

          // Dismiss the modal
          currentVC.dismiss(animated: false, completion: nil)
        }
        
        // Move up to parent
        currentVC = presentingVC
      }
    }
  }
} 
