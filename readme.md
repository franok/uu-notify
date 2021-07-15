# uuNotify

_uuNotify_ is a script that can be used to regularly check for updates of software, installed on your [Uberspace](https://uberspace.de).

It requires a gotify server, which will send gotify notifications ("gotifications") to your client (e.g. smartphone), if updates are available.
The script will not install the updates automatically.

The script is intended to be regularly run by a cronjob.


## Limitations

* Currently, a gotification is sent out only once per available update.
* Since _uuNotify_ uses the GitHub API, only software from GitHub is checked for updates. However if there is a need, also other RSS feeds could be supported ([#2](https://github.com/franok/uu-notify/issues/2)).


## References

[GitHub API](https://docs.github.com/en/rest/reference/repos#releases) using [octokit](https://www.npmjs.com/package/@octokit/core)


Using _uuNotify_ with a [GitHub personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) to avoid running into [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).
The token doesn't need any scopes.

sqlite API: https://www.npmjs.com/package/sqlite

## development

node v14

```
NODE_ENV=development node index.mjs
```





