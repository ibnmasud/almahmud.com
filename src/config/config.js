var pp = require('./public');
var PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgGklWf9rF9g2RlcgLxXFc/DnIcPpVWnbYTZdbVX58LjAXihHjC/W
XVwQBuaWOoz/5OMa1622vSR7fV956kOjMjvu6CVbo4ypQyWqip5Ue1YHnUkqu6UB
YaW0vaYdwk7Fb19z3Fba6SmLehfpZLtYzMUxZJhnwX5zXGPXO4AvPixpAgMBAAEC
gYBcVO54+sQPm2mdbKesSJ4NeAoQjb/xmzH8mYI/s6INuu90E5ApGecVxwUoS9fS
pYuLWrD23LevZ7mqs9Zh2tdq3z9kQoQ8obSdWpU7WpOGjzCEWrRJbx2pXT5NxZ67
oKbWI3A3DGMlGKwX9V9bVrZM42S8eWA++vZ+R1hLDFslAQJBAMquK3hM0jtNzhrM
JJZcITMPWIwAzdRk3OhXf1iEb9xj0PwzfA0aN0o2sxGVS0WQJKjnU8EufMoKTRGu
XfKfJ5ECQQCEzpHMT+iIMqTVBzt54866xrPMIFvxSUsIKv5M1St8eAU+ryIwCz2u
ZIfvAb62RNKYg4gvMkEWwFbRsVCDmztZAkEAkZJ9OF981AlzEj4zvScY1VKdV5kw
PO/g1qQZnBsrONEchjf4TnTY513YSbXAJYt9OS9FMchQ6tBxQFTLt3pmcQJAV6XM
6z5BhMGHr2AajJMgOHwy5SDmDRQGBNn7AtIc5QSA0aHbukFw78tBOye3qas6IZWN
JzjPZCiEI9gV/wVP4QJBALW2f9YgwjnAPSlpHm7XOxux+Ck4OUmLztCsJPB9Iuog
cVbO7SxVR1z5YtDdxY0UI9BTX+0MXbDWIouH4kET3HI=
-----END RSA PRIVATE KEY-----`
var PUBLIC_KEY=`-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGklWf9rF9g2RlcgLxXFc/DnIcPp
VWnbYTZdbVX58LjAXihHjC/WXVwQBuaWOoz/5OMa1622vSR7fV956kOjMjvu6CVb
o4ypQyWqip5Ue1YHnUkqu6UBYaW0vaYdwk7Fb19z3Fba6SmLehfpZLtYzMUxZJhn
wX5zXGPXO4AvPixpAgMBAAE=
-----END PUBLIC KEY-----`
var config = {
  TOKEN_EXPIERY_LENGTH: 1 * 60 * 60 * 1000,
  MAX_AUTHOR_IMAGE:1,
  WEB_TOKEN_EXPIERY: {
    web: '1h',
    user: '1h',
    admin: '1h'
  },
  JTW_TOKEN: {
    web: 0,
    user: 1,
    admin: 2
  },
  PRIVATE_KEY,
  PUBLIC_KEY
};

for (var a in pp) {
  config[a] = pp[a];
}
for (var b in config) {
  if (process.env[b]) {
    config[b] = process.env[b];
  }
}
module.exports = config;
