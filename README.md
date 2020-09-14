# CODA-19 dashboard

### Installing Node

https://nodejs.org/en/download/

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

### Cloning and installing dependencies

```
git clone https://github.com/CODA-19/dashboard
cd dashboard
npm install
```

### Launching ExpressJS

Defaults to launching on `localhost:3000`.

```bash
npm start
```

