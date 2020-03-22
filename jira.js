const JiraClient = require("jira-connector");

async function getIssues(host, email, token, since, boardId, projectKey) {
    const jira = new JiraClient({
        host: host,
        strictSSL: true,
        basic_auth: {
            email: email,
            api_token: token
        }
    });

    try {
        const result = await jira.board.getIssuesForBoard({ boardId: boardId, jql: `project = "${projectKey}" AND type = Bug AND status = Done AND resolved > -${since}d`, maxResults: 500 });
        return result.issues;
    } catch (error) {
        return { error: JSON.parse(error).body.errors };
    }
}


async function test() {
    const issues = await getIssues(30, 32, 'HT');
    console.log(issues)
}
//test();

module.exports = getIssues;