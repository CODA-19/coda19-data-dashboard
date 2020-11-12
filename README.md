# CODA-19 Dashboard Server

The dashboard server enables basic interactivity with client sites of the CODA-19 project. It aims to be one of the interactive front-ends for privacy conserving analysis.

As part of a microservice environment, the dashboard will communicate with:

(1) The terminology server for questions about concept and relations between knowledge.
(2) The Hub for federated communication to the participating sites
(3) The keycloack instance for Authentication and Authorizations.

![Dashboard Diagram](/diagram.png?raw=true "DiagramIO Dashboard Overview")

## Running Development Server

Update local NPM package with `npm install` and launch the app with `npm start` which defaults to listening on `localhost:3000`.

As this application is part of a larger insfrastructure, this application alone will have limited functionalities. To launch a test infrastructure, you can use `docker-compose up` at the root of this repo. It will require a local copy of the other repo in the parent folder.

## Dependencies

### To run the app

* NodeJS - [website](https://nodejs.org/en/download)

### For the test infrastructure

* Docker and Docker-Compose

### Installing R

#### Mac OS X

```bash
brew cask install xquartz
brew cask install r
r
  > install.packages("readr")
  > install.packages("metafor")
  > install.packages("RCurl")
```

## Contributing

If you have any questions or want to contribute there are two solutions. If you are part of the CODA-19 consortium, come on Basecamp. If not, contact us on https://coda19.com/.