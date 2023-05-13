module.exports.cleanupCaches = app => {

    app.on("pull_request.closed", async context => {
        context.log.info(context.payload.pull_request.number)
        let content = await context.octokit.request('GET /repos/{owner}/{repo}/actions/caches?ref={branch}', {
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            branch: `refs/pull/${context.payload.pull_request.number}/merge`,
        })
        context.log.info(content.data)
        if (content.data.total_count > 0) {
            content.data.actions_caches.forEach(async cache => {
                await context.octokit.request('DELETE /repos/{owner}/{repo}/actions/caches?key={key}', {
                    owner: context.payload.repository.owner.login,
                    repo: context.payload.repository.name,
                    key: cache.key,
                })
            })
        }
    });

}