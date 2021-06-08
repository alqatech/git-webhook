# Auto Deployment Webhook
## Node Service to auto deploy code on webhooh request

### How to Setup
- pull code on server 
- run npm install
- edit config file 
- create certificates in cert directory to enable SSL mode
- put secret token in config

```sh
npm install
node webhook
```

### How to create certificcates

```sh
mkdir cert
cd cert/
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```
