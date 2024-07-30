import initApp from "./app";
import https from 'https';
import http from 'http';
import fs from 'fs';

initApp().then((app) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Development mode');
    http.createServer(app).listen(process.env.PORT, () => {
      console.log(
        "App is listening at http://localhost:" + process.env.PORT || 3000
      );
    });
  } else {
    console.log('Production mode');
    const options = {
      key: fs.readFileSync('./client-key.pem'),
      cert: fs.readFileSync('./client-cert.pem')
    };
    https.createServer(options, app).listen(process.env.HTTPS_PORT, () => {
      console.log(
        "App is listening at https://localhost:" + process.env.HTTPS_PORT
      );
    });
  }
});
