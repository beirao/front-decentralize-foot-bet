# Frontent decentralize foot bet - aka BoarBet

Live demo : [boarbet.beirao.me](https://boarbet.beirao.me)

## Getting Started

### Install all dependencies 

```bash
yarn
```

### Development run

```bash
yarn dev
```

### Production run

```bash
yarn build
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# Docker



## Build

```bash
sudo docker build -t front-boarbet . --network="host"
```


## Run image

```bash
sudo docker run -p 3000:3000 front-boarbet
```

## Save the image

```bash
sudo docker save -o front-boarbet.tar front-boarbet
```


