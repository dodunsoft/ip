import express from 'express';
import geoip from 'geoip-lite';

const app = express();
app.set('trust proxy', true);


app.get('/', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (typeof ip === 'string') {
    ip = ip.split(',')[0].trim();
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }
  }

  const geo = geoip.lookup(ip);

  console.log('IP:', ip);
  console.log('Geo:', geo);

  res.json({
    ip,
    country: geo?.country,
    region: geo?.region,
    city: geo?.city,
    lat: geo?.ll?.[0],
    lon: geo?.ll?.[1]
  });
});

app.listen(3000, () => console.log('listening on :3000'));
