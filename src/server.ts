import initApp from "./app";

initApp().then((app) => {
  app.listen(process.env.PORT, () => {
    console.log(
      "App is listening at http://localhost:" + process.env.PORT || 3000
    );
  });
});
