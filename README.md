# YouTube Direct

YouTube Direct is a project created on April 2, 2023 by Phoenix_R49 to allow everyone to be able to download YouTube videos for free and without advertisements.

## Installation

### Prerequisite

[Node.js](https://nodejs.org) (V14 or more)

### Commands

```
$ git clone https://github.com/PhoenixR49/youtube-direct.git
$ cd youtube-direct
$ npm install
$ npm start
```

> Si vous avez une alerte dont le contenu est : ytdl-core is out of date! Update with "npm install ytdl-core@latest", ne le faites pas car ceci va causer des bugs lors du téléchargement de la vidéo.

### Implementation of YouTube search :

- Rename the file ".env config" by ".env".
- Open it with the code editor of your choice.
- In the environment variable "YOUTUBE_API_KEY", replace "MY_API_KEY" by one [YouTube API key](#how-to-have-a-youtube-api-key).

#### How to have a youtube API key ?

- Go to [the Google Cloud Console](https://console.cloud.google.com).
- Create a new project.
- Open the menu on the left, click on "API and services" then credentials.
- Click the "Create credentials" button, copy the generated API key and paste it in the "YOUTUBE_API_KEY" environment variable.

There you go, you have a YouTube Downloader running locally on your computer !

> Go to [localhost:3000](http://localhost:3000) to start uploading your videos !

## Web App

> Go to [the online version](https://youtube-direct.vercel.app/).

![Website](https://img.shields.io/website?url=https%3A%2F%2Fyoutube-direct.vercel.app)

## License

[YouTube Direct](https://youtube-direct.vercel.app/) by [Phoenix_R49](https://linktr.ee/Phoenix_R49) is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1).
