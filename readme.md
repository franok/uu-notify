# UberUpdateWatcher

The _UberUpdateWatcher_ is a script that can be used to regularly check for updates of software, installed on your [Uberspace](uberspace.de).

It requires a gotify server, which will send gotify notifications ("gotifications") to your client (e.g. smartphone), if updates are available.
The script will not install the updates automatically.

The script is intended to be regularly run by a cronjob.


## Limitations

* Currently, a gotification is sent out only per available update.
* Since _UberUpdateWatcher_ uses the GitHub API, only software from GitHub is checked for updates. However if there is a need, one also support other RSS feeds.


## References

[GitHub API](https://docs.github.com/en/rest/reference/repos#releases) using [octokit](https://www.npmjs.com/package/@octokit/core)


configure _UberUpdateWatcher_ to use a [github personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) to avoid running into [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).
the token doesn't need any scopes.

sqlite API: https://www.npmjs.com/package/sqlite

## development

```
NODE_ENV=development node index.mjs
```


## Future versions

todo: transfer into github issues

### auto-update functionality
Try to auto-update patch levels (or even minor versions?). Send notification about update availability, execute update, send notification about success/failure. Probably not a good idea, since not all sofware projects do follow semver and could include breaking changes. 

### RSS Parser
If software is installed from elsewhere than GitHub, one probably would have to add an RSS parser and run it in combination to octogit. See: https://www.npmjs.com/package/rss-parser

### gotify alternative
make it the user's choice whether to use gotify or just send the update infos via email. needs a notification-util-interface to call different implementations, based on config.


