import initApp from "./app";
import https from 'https';

initApp().then((app) => {
  https.createServer(app).listen(process.env.PORT, () => {
      console.log(
        "App is listening at http://localhost:" + process.env.PORT || 3000
      );
    });
});
