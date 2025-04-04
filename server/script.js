const usbDetect = require('usb-detection');
const readline = require('readline');

const TARGET_VENDOR_ID = 0x058F; // Flash Drive Vendor ID (Alcor Micro Corp.)
const TARGET_PRODUCT_ID = 0x6387; // Flash Drive Product ID

let usbInserted = false;
let loggedIn = false;
let countdownTimer = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to check USB on startup
function checkUSB() {
  usbDetect.find((err, devices) => {
    if (err) {
      console.error('Error detecting USB:', err);
      return;
    }

    const usbDevice = devices.find(device =>
      device.vendorId === TARGET_VENDOR_ID && device.productId === TARGET_PRODUCT_ID
    );

    if (!usbDevice) {
      console.error('❌ No authorized USB found. Waiting for USB...');
      usbInserted = false;
      return;
    }

    if (!usbInserted) {
      usbInserted = true;
      console.log(`✅ USB Connected: VendorID=${usbDevice.vendorId}, ProductID=${usbDevice.productId}`);
      requestLogin();
    }
  });
}

// Function to request user login
function requestLogin() {
  rl.question('Enter Organization Code: ', (orgCode) => {
    rl.question('Enter Username: ', (username) => {
      rl.question('Enter Password: ', (password) => {
        if (orgCode === 'ORG123' && username === 'admin' && password === 'password') {
          console.log('✅ Login Successful!');
          loggedIn = true;
          monitorUSB();
        } else {
          console.error('❌ Invalid Credentials! Try Again.');
          rl.close();
        }
      });
    });
  });
}

// Function to monitor USB status
function monitorUSB() {
  console.log('Monitoring USB status...');

  usbDetect.on('remove', (device) => {
    if (device.vendorId === TARGET_VENDOR_ID && device.productId === TARGET_PRODUCT_ID) {
      console.warn('⚠️ USB Removed! Countdown to logout started.');
      usbInserted = false; // Mark USB as removed
      startLogoutCountdown();
    }
  });

  usbDetect.on('add', (device) => {
    if (device.vendorId === TARGET_VENDOR_ID && device.productId === TARGET_PRODUCT_ID) {
      console.log('🔌 USB Inserted. Checking device...');
      usbInserted = true;
      
      // Stop logout countdown if USB is reinserted before logout
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        console.log('🛑 USB Reinserted: Logout canceled.');
      }

      // If user was logged out, ask for login again
      if (!loggedIn) {
        requestLogin();
      }
    }
  });
}

// Function to start logout countdown
function startLogoutCountdown() {
  let countdown = 5 * 60; // 5 minutes

  countdownTimer = setInterval(() => {
    countdown--;

    // If USB is reinserted, stop the countdown
    if (usbInserted) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      console.log('🛑 USB Reinserted: Logout canceled.');
      return;
    }

    console.log(`Logout in ${countdown} seconds.`);

    if (countdown <= 0) {
      clearInterval(countdownTimer);
      console.log('🚪 Auto Logout Due to USB Key Removal.');
      loggedIn = false;
      rl.close();
    }
  }, 1000);
}

// Start USB Monitoring
usbDetect.startMonitoring();
checkUSB();





























// const usbDetect = require('usb-detection');
// const readline = require('readline');

// const TARGET_VENDOR_ID = 0x058F;  // Flash Drive Vendor ID (Alcor Micro Corp.)
// const TARGET_PRODUCT_ID = 0x6387; // Flash Drive Product ID

// let usbInserted = false;
// let loggedIn = false;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// function checkUSB() {
//   usbDetect.find((err, devices) => {
//     if (err) {
//       console.error('Error detecting USB:', err);
//       return;
//     }

//     const usbDevice = devices.find(device =>
//       device.vendorId === TARGET_VENDOR_ID && device.productId === TARGET_PRODUCT_ID
//     );

//     if (!usbDevice) {
//       console.error('❌ No authorized USB found. Waiting for USB...');
//       usbInserted = false;
//       return;
//     }

//     if (!usbInserted) {
//       usbInserted = true;
//       console.log(`✅ USB Connected: VendorID=${usbDevice.vendorId}, ProductID=${usbDevice.productId}`);
//       requestLogin();
//     }
//   });

//   setInterval(() => {
//     usbDetect.find((err, devices) => {
//       if (err) {
//         console.error('Error detecting USB:', err);
//         return;
//       }

//       const usbDevice = devices.find(device =>
//         device.vendorId === TARGET_VENDOR_ID && device.productId === TARGET_PRODUCT_ID
//       );

//       if (usbDevice && !usbInserted) {
//         usbInserted = true;
//         console.log(`✅ USB Connected: VendorID=${usbDevice.vendorId}, ProductID=${usbDevice.productId}`);
//         requestLogin();
//       } else if (!usbDevice && usbInserted) {
//         usbInserted = false;
//         console.warn('⚠️ USB Removed! Waiting for reconnection...');
//       }
//     });
//   }, 1000); // Check every 1 second
// }


// // Function to request user login
// function requestLogin() {
//   rl.question('Enter Organization Code: ', (orgCode) => {
//     rl.question('Enter Username: ', (username) => {
//       rl.question('Enter Password: ', (password) => {
//         if (orgCode === 'ORG123' && username === 'admin' && password === 'password') {
//           console.log('✅ Login Successful!');
//           loggedIn = true;
//           monitorUSB();
//         } else {
//           console.error('❌ Invalid Credentials! Try Again.');
//           rl.close();
//         }
//       });
//     });
//   });
// }

// // Function to monitor USB removal
// function monitorUSB() {
//   console.log('Monitoring USB status...');

//   usbDetect.on('remove', (device) => {
//     if (device.vendorId === TARGET_VENDOR_ID && device.productId === TARGET_PRODUCT_ID) {
//       console.warn('⚠️ USB Removed! Countdown to logout started.');
//       usbInserted = false; // Mark USB as removed
//     usbDetect.stopMonitoring(); // Stop monitoring and restart it
//     setTimeout(() => usbDetect.startMonitoring(), 1000);
//       startLogoutCountdown();
//     }
//   });
// }

// // Function to start logout countdown
// function startLogoutCountdown() {
//   let countdown = 5 * 60; // 5 minutes

//   const timer = setInterval(() => {
//     countdown--;
//     console.log(`Logout in ${countdown} seconds.`);

//     if (countdown <= 0) {
//       clearInterval(timer);
//       console.log('🚪 Auto Logout Due to USB Key Removal.');
//       loggedIn = false;
//       rl.close();
//     }
//   }, 1000);
// }

// // Start USB Monitoring
// usbDetect.startMonitoring();

// // Listen for USB insertion
// usbDetect.on('add', (device) => {
//   if (device.vendorId === TARGET_VENDOR_ID && device.productId === TARGET_PRODUCT_ID) {
//     console.log('🔌 USB Inserted. Checking device...');
//     if (!usbInserted) {
//       checkUSB();
//     }
//   }
// });

// // Initial check
// checkUSB();

























// const HID = require('node-hid');
// const usbDetect = require('usb-detection');
// const readline = require('readline');

// // const TARGET_VENDOR_ID = 0x1234;  // Replace with your USB's Vendor ID
// // const TARGET_PRODUCT_ID = 0x5678; // Replace with your USB's Product ID
// // const TARGET_SERIAL_NUMBER = '';  // Optional: Use specific serial number if needed
// const TARGET_VENDOR_ID = 0x058F;  // Flash Drive Vendor ID (Alcor Micro Corp.)
// const TARGET_PRODUCT_ID = 0x6387; // Flash Drive Product ID
// // const TARGET_SERIAL_NUMBER = '';  // Keep empty if you don’t want serial number verification

// let usbInserted = false;
// let loggedIn = false;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });


// // Function to check USB presence
// function checkUSB() {
//   const devices = HID.devices();
//   console.log(HID.devices());
//   const usbDevice = devices.find(device =>
//     device.vendorId === TARGET_VENDOR_ID &&
//     device.productId === TARGET_PRODUCT_ID &&
//     (TARGET_SERIAL_NUMBER === '' || device.serialNumber === TARGET_SERIAL_NUMBER)
//   );

//   if (!usbDevice) {
//     console.error('❌ No authorized USB found. Waiting for USB...');
//     return false;
//   }

//   usbInserted = true;
//   console.log(`✅ USB Connected: VendorID=${usbDevice.vendorId}, ProductID=${usbDevice.productId}, Serial Number=${usbDevice.serialNumber || 'N/A'}`);
//   requestLogin();
//   return true;
// }

// // Function to request user login
// function requestLogin() {
//   rl.question('Enter Organization Code: ', (orgCode) => {
//     rl.question('Enter Username: ', (username) => {
//       rl.question('Enter Password: ', (password) => {
//         if (orgCode === 'ORG123' && username === 'admin' && password === 'password') {
//           console.log('✅ Login Successful!');
//           loggedIn = true;
//           monitorUSB();
//         } else {
//           console.error('❌ Invalid Credentials! Try Again.');
//           rl.close();
//         }
//       });
//     });
//   });
// }

// // Function to monitor USB removal
// function monitorUSB() {
//   console.log('Monitoring USB status...');

//   setInterval(() => {
//     const devices = HID.devices();
//     const usbDevice = devices.find(device =>
//       device.vendorId === TARGET_VENDOR_ID &&
//       device.productId === TARGET_PRODUCT_ID &&
//       (TARGET_SERIAL_NUMBER === '' || device.serialNumber === TARGET_SERIAL_NUMBER)
//     );

//     if (!usbDevice && loggedIn) {
//       console.warn('⚠️ USB Removed! Countdown to logout started.');
//       startLogoutCountdown();
//     }
//   }, 5000);
// }

// // Function to start logout countdown
// function startLogoutCountdown() {
//   let countdown = 5 * 60; // 5 minutes

//   const timer = setInterval(() => {
//     countdown--;
//     console.log(`Logout in ${countdown} seconds.`);

//     if (countdown <= 0) {
//       clearInterval(timer);
//       console.log('🚪 Auto Logout Due to USB Key Removal.');
//       loggedIn = false;
//       rl.close();
//     }
//   }, 1000);
// }

// // Listen for USB insertion
// usbDetect.startMonitoring();

// usbDetect.find((err, devices) => {
//   if (err) {
//     console.error('Error detecting USB devices:', err);
//   } else {
//     console.log('Connected USB Devices:', devices);
//   }
// });


// usbDetect.on('add', (device) => {
//   if (device.vendorId === TARGET_VENDOR_ID && device.productId === TARGET_PRODUCT_ID) {
//     console.log('🔌 USB Inserted. Checking device...');
//     if (!usbInserted) {
//       checkUSB();
//     }
//   }
// });

// // Listen for USB removal
// usbDetect.on('remove', (device) => {
//   if (device.vendorId === TARGET_VENDOR_ID && device.productId === TARGET_PRODUCT_ID) {
//     console.warn('⚠️ USB Removed!');
//     if (loggedIn) {
//       startLogoutCountdown();
//     }
//   }
// });

// // Initial check
// checkUSB();











// const HID = require('node-hid');
// const readline = require('readline');

// // Using your device's VID and PID
// const TARGET_VENDOR_ID = 0;
// const TARGET_PRODUCT_ID = 0;
// const TARGET_SERIAL_NUMBER = ''; // Optional, can be left empty for non-specific matching

// let usbInserted = false;
// let loggedIn = false;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// function checkUSB() {
//   const devices = HID.devices();

//   const usbDevice = devices.find(device =>
//     device.vendorId === TARGET_VENDOR_ID &&
//     device.productId === TARGET_PRODUCT_ID &&
//     (TARGET_SERIAL_NUMBER === '' || device.serialNumber === TARGET_SERIAL_NUMBER)
//   );

//   if (!usbDevice) {
//     console.error('Access Blocked! Please insert the correct USB storage device.');
//     return;
//   }

//   usbInserted = true;
//   console.log(`✅ USB Connected: VendorID=${usbDevice.vendorId}, ProductID=${usbDevice.productId}, Serial Number=${usbDevice.serialNumber || 'N/A'}`);
//   console.log('USB Detected. Please proceed.');
//   requestLogin();
// }


// function requestLogin() {
//   rl.question('Enter Organization Code: ', (orgCode) => {
//     rl.question('Enter Username: ', (username) => {
//       rl.question('Enter Password: ', (password) => {
//         if (orgCode === 'ORG123' && username === 'admin' && password === 'password') {
//           console.log('✅ Login Successful!');
//           loggedIn = true;
//           monitorUSB();
//         } else {
//           console.error('❌ Invalid Credentials! Please Try Again.');
//           rl.close();
//         }
//       });
//     });
//   });
// }

// function monitorUSB() {
//   console.log('Monitoring USB status...');
//   setInterval(() => {
//     const devices = HID.devices();
//     const usbDevice = devices.find(device =>
//       device.vendorId === TARGET_VENDOR_ID &&
//       device.productId === TARGET_PRODUCT_ID &&
//       (TARGET_SERIAL_NUMBER === '' || device.serialNumber === TARGET_SERIAL_NUMBER)
//     );

//     if (!usbDevice && loggedIn) {
//       console.warn('⚠️ USB Key Removed! Countdown to Logout Started.');
//       startLogoutCountdown();
//     }
//   }, 10000);
// }

// function startLogoutCountdown() {
//   let countdown = 5 * 60;
//   const timer = setInterval(() => {
//     countdown--;
//     console.log(`Logout in ${countdown} seconds.`);

//     if (countdown <= 0) {
//       clearInterval(timer);
//       console.log('🚪 Auto Logout Due to USB Key Removal.');
//       loggedIn = false;
//       rl.close();
//     }
//   }, 1000);
// }

// // Initial USB Check
// checkUSB();
