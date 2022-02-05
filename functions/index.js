const functions = require('firebase-functions');
const config = functions.config();
const credential = config['credential'];
const Twit = require('twit');

const T = new Twit({
  consumer_key: credential.twitter.consumer_key,
  consumer_secret: credential.twitter.consumer_secret,
  access_token: credential.twitter.access_token,
  access_token_secret: credential.twitter.access_token_secret,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

exports.postImage = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    let imageUrl = '';
    await T.post('media/upload', { media_data: data.image }).then(
      async (result) => {
        const mediaIdStr = result.data.media_id_string;
        const meta_params = {
          media_id: mediaIdStr,
        };
        await T.post('media/metadata/create', meta_params).then(async () => {
          const params = {
            media_ids: [mediaIdStr],
          };
          await T.post('statuses/update', params).then(async (result) => {
            imageUrl = await result.data.text;
          });
        });
      }
    );
    return imageUrl;
  });
