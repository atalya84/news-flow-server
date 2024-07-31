module.exports = {
  apps : [{
    name   : "news-flow-server",
    script : "./dist/server.js",
    env_production : {
	  NODE_ENV: "production"
    }
  }]
}
