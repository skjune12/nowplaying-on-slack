const request = require('request');
const yaml = require('js-yaml');
const fs = require('fs');
const { exec } = require('child_process');

const tokens = yaml.safeLoad(fs.readFileSync('./tokens.yaml', 'utf8'));
const spotifyScript = './bin/get-playing-on-spotify';

const sendToSlack = ({ token, emoji, message }) => {
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

const watchSpotify = () => {
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
            const emoji = (m.state === 'playing') ? ':headphones:' : ':musical_note:';
            try {
                for (i in tokens) {
                    var token = tokens[i];
                    sendToSlack({ token, message, emoji });
                }
            } catch (e) {
                console.log(e);
            }
            console.log(m);
        });
    }, 3000);
};

if (!tokens) {
    console.log('token ga naiyo');
    process.exit();
}

watchSpotify();
