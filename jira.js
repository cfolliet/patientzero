const JiraClient = require("jira-connector");
const jira = new JiraClient({
    host: 'talentsoft.atlassian.net',
    strictSSL: true,
    basic_auth: {
        email: 'cfolliet@talentsoft.com',
        api_token: 'CbRTMwyKytnj1UkqqAna1134'
    }
});

async function getIssues() {
    const result = await jira.board.getIssuesForBoard({ boardId: 32, jql: 'project = "HT" AND type = Bug AND status = Done AND resolved > -365d', maxResults: 100 });
    return result.issues;
}


async function test(){
    const issues = await getIssues();
    console.log(issues)
}
//test();

module.exports = getIssues;