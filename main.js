const { app } = require('electron');
const request = require('request');
const { exec } = require('child_process');

const token = process.env.SLACK_API_TOKEN;
const spotifyScript = './bin/get-playing-on-spotify';

const sendToSlack = ({ emoji, message }) => {
  request({
    url: 'https://slack.com/api/users.profile.set',
    method: 'POST',
    form: {
      token,
      profile: JSON.stringify({
        status_text: message,
        status_emoji: emoji,
      }),
    },
  }, (error, response, body) => {
    if (!error) {
      return;
    }

    console.error(error, response, body);
  });
};

const watchSoptify = () => {
  let before;

  setInterval(() => {
    exec(spotifyScript, (e, stdout, stderr) => {
      if (e) {
        console.error(e);
        return;
      }
      if (stderr) {
        console.error(stderr);
        return;
      }

      const m = JSON.parse(stdout);
      if ('error' in m) {
        console.error(m.error);
        return;
      }

      if (before === JSON.stringify(m)) {
        // console.log('not change');
        return;
      }
      before = JSON.stringify(m);
      const message = `${m.track} - ${m.artist}`;
      const emoji = (m.state === 'playing') ? ':spotify:' : ':musical_note:';
      sendToSlack({ message, emoji });
      console.log(m);
    });
  }, 3000);
};

app.on('ready', () => {
  if (!token) {
    console.log('token ga naiyo');
    return;
  }

  watchSoptify();
});
