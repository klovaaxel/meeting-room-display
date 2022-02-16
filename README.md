# Meeting room display
![GitHub contributors](https://img.shields.io/github/contributors/klovaaxel/meeting-room-display?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/klovaaxel/meeting-room-display?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/klovaaxel/meeting-room-display?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/klovaaxel/meeting-room-display?style=flat-square)

PWA for meeting room displays that fetch from a ICS file
[Github Pages Deployment](https://klovaaxel.github.io/meeting-room-display/)

## Contents
- [Supported calendars](#Supported-calendars)
- [How to get ICAL/ICS feed from your calendar](#How-to-get-ICAL/ICS-feed-from-your-calendar)
- [Installation](#Installation)
- [How to contribute](#How-to-contribute)
- [Contributors](#Contributors)

## Supported calendars
The calendar is linked with a ical ICS feed with a public link, dependig on what URL and domain you are using you might need to disable CORS on your browser/whitelist this webpage from using CORS

- ✔ Outlook Calendar
- ✕ Google Calendar  (working on new ICS/ICAL parser)

## How to get ICAL/ICS feed from your calendar
This largley depends on what calendar you are using. \
(See "Supported calendars" for a list of calendar this PWA has been tested with)
### Outlook Calendar
For Outlook you can publish an ICS feed if you go to 
- Settings (Cog up in the right corner), 
- All outlook calendar settings, 
- Shared calendars, 
- Publish a calendar

[Link to more indepth tutorial](https://support.microsoft.com/en-us/office/share-your-calendar-in-outlook-on-the-web-7ecef8ae-139c-40d9-bae2-a23977ee58d5)\
[Link to share a Room Outlook calendar](https://answers.microsoft.com/en-us/outlook_com/forum/all/how-do-i-publish-a-room-calendar/2c1f5f65-4e74-40fb-b9b2-e8c8fe34ba3b)

### Google Calendar
[Link to Google documentation](https://support.google.com/calendar/answer/37083?hl=en)

## Installation
### The calendar is linked with a public link to an ical ICS feed 
This means that you might need to do one of the following 
- Use a proxyserver, like [cors-anywhere](https://github.com/Rob--W/cors-anywhere), with correct [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers
- Disable [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) on your browser / whitelist the URL of the [Meeting Room Dispaly](https://klovaaxel.github.io/meeting-room-display/) (can easily be done with a chromium plugin)

### Steps to install
1. Ethier use this github pages as is or fork this repository and publsih your fork as a webpage accessible form your hardware.

    -  If forked or downloaded, customize your version with your branding!

2. Share/Publish your calendar as a ics feed with a url that your hardware can access. (see [How to get ICAL/ICS feed from your calendar](#How-to-get-ICAL/ICS-feed-from-your-calendar))

3. On your hardware navigate to the public webpage and [download the PWA](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DAndroid) ([on ios add it to homescreen](https://mobilesyrup.com/2020/05/24/how-install-progressive-web-app-pwa-android-ios-pc-mac/#:~:text=Navigate%20to%20the%20website%20you,like%20a%20native%20iOS%20app.)) 

4. Lock your hardware to the PWA and make it open it on boot!

5. Enter room/screen name, and your ICS url on the webpage and press continue and the info should be displayed.
    - If you used a proxy server to get around [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) issues use the link you get from it.
6. You can also add the name and ics url into the url by appending ?name=YourName&icsurl=YourICSURL. This can be done for sharing links to your rooms calendar/availabilty

## How to contribute
1. Create a fork of this project
2. (Recomended) Make a dev branch on your fork (so thay you can recive uppstream changes on your main branch)
3. Make your changes!
4. Put all your changes into the correct branch
5. Make a pull request!

## Contributors
<a href="https://github.com/klovaaxel/meeting-room-display/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=klovaaxel/meeting-room-display" />
</a>