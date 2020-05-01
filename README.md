<h1>Based off: Blue HomeLab [Private]</h1>
A consumer app which delivers real-time data read in from water sensors.

<h1>Purpose:</h1>
When a water supply gets contaminated, it takes weeks for the water to be collected, sent to a laboratory,
and tested. However, if there's something wrong with your car, there are over 50 icons which can be displayed
on a dashboard to notify the driver. Humans can go weeks without food, but only days without water.
Why should we settle for this when the technology exists to detect contaminations in real time?

<h1>Installation:</h1>
To get a copy of the app, download this repository. Next, make sure you either have a physical Android device
or an Android emulator on your computer. Enter command "npm start" to start the development server, then
"npm run android" to start the app. Voila!

<h1>Firebase Integration:</h1>
This project is HEAVILY integrated with Firebase. Without Firebase integration, the app will only display the main screen & won't send
notifications. Make sure you create a project in Firebase under your own account and follow the instructions to set it up. Then, in the 
root directory, run "firebase init" to connect your app to a Firebase project. This is necessary if you want to keep a database and send 
notifications.
