require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name            = "CBModalManager"
  s.version         = package['version']
  s.summary         = package['description']
  s.license         = package['license']
  s.authors         = package['author']
  s.homepage        = package['homepage']
  s.source       = { :git => package['repository']['url'], :tag => "#{s.version}" }
  s.platform     = :ios, "12.0"
  s.swift_version  = '5.4'
  s.requires_arc = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,swift}"
end
