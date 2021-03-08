# CODA-19 Dashboard Server

The dashboard server enables basic interactivity with client sites of the CODA-19 project. It aims to be one of the interactive front-ends for privacy conserving analysis.

As part of a microservice environment, the dashboard will communicate with:

(1) The terminology server for questions about concept and relations between knowledge.
(2) The Hub for federated communication to the participating sites
(3) The keycloack instance for Authentication and Authorizations.

![Dashboard Diagram](/assets/diagram.png?raw=true "DiagramIO Dashboard Overview")

## Development

In order to develop on the data dashboard, you must choose what infrastructure to use. You can use a fake standalone infrastructure with `docker-compose` or connect to the `deployed public hub`. These instructions will be for the standalone version.

First, the folder structure must look like this with up-to-date repository (and this repo at the dev. branch)

```
ROOT
 |-> coda19-data-dashboard
   |-> Launch docker-compose from here.
 |-> coda19-hub-api
 |-> coda19-site-api
 |-> coda19-stats-api
```

Then, make sure you have a `.env` file both in the `coda19-data-dashboard` root folder, but also in the `front-end/` folder. Contact a team member to know the content of these files. Then, you must launch the backend infrastructure with `docker-compose -f .\docker-compose.no-dash.yml up`. After that, you can start the back-end, by going to this folder and running `yarn start`. Finally, the front-end can be launched by going to its folder and running `npm run start`. Imp. the front-end doesn't support `yarn` at the moment.

Note. Yarn is configured as a ZeroInstall using v2. So, you shouldn't have to run yarn install.

## Dependencies

### To run the app

* NodeJS - [website](https://nodejs.org/en/download)
* Yarn - [website](https://classic.yarnpkg.com/en/docs/install)

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