
# Add these or source this file into .zshrc
adb_go_offline() {
  adb shell svc wifi disable
  adb shell svc data disable
  echo "Done"
}

adb_go_online() {
  adb shell svc wifi enable
  adb shell svc data enable
  echo "Done"
}

adb_screenshot() {
  if [ $# -eq 0 ]
  then
    name="screenshot.png"
  else
    name="$1.png"
  fi
  adb shell screencap -p /sdcard/$name
  adb pull /sdcard/$name
  adb shell rm /sdcard/$name
  curr_dir=pwd
  echo "save to `pwd`/$name"
}

