# YouTube Direct

![GitHub package.json version](https://img.shields.io/github/package-json/v/PhoenixR49/youtube-direct?style=for-the-badge)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/PhoenixR49/youtube-direct?style=for-the-badge)

YouTube Direct is a project created on April 2, 2023 by Phoenix_R49 to allow everyone to be able to download YouTube videos for free and without advertisements.

## Installation

### Prerequisite

![Node.js version](https://img.shields.io/badge/Node.js-V14%20or%20more-brightgreen?style=for-the-badge&logo=node.js)

### Commands

```
git clone https://github.com/PhoenixR49/youtube-direct.git
cd youtube-direct
npm install
npm start
```

### Implementation of YouTube search

- Rename the file ".env config" by ".env".
- Open it with the code editor of your choice.
- In the environment variable "YOUTUBE_API_KEY", replace "MY_API_KEY" by one [YouTube API key](#how-to-have-a-youtube-api-key).

#### How to have a YouTube API key ?

- Go to [the Google Cloud Console](https://console.cloud.google.com).
- Create a new project.
- Open the menu on the left, click on "API and services" then credentials.
- Click the "Create credentials" button, copy the generated API key and paste it in the "YOUTUBE_API_KEY" environment variable.

There you go, you have a YouTube Downloader running locally on your computer !

> Go to [localhost:3000](http://localhost:3000) to start uploading your videos !

## Web App

> Go to [the online version](https://youtube-direct.netlify.app/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/77eee56a-2fb5-42bc-86f8-fafd8f20b8c2/deploy-status)](https://app.netlify.com/sites/youtube-direct/deploys)

## License

[YouTube Direct](https://youtube-direct.netlify.app/) by [Phoenix_R49](https://linktr.ee/Phoenix_R49) is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1).