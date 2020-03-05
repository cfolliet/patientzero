const getIssues = require('./jira.js');
const getCommits = require('./bitbucket.js');

function joinIssuesAndCommits(issues, commits) {
    const files = new Map;

    let matchCount = 0;
    let noMatchCount = 0;
    issues.forEach(i => {
        const commit = commits.find(c => c.message.indexOf(i.key) > 0)
        if (commit) {
            matchCount++;

            commit.files.forEach(f => {
                let file = files.get(f);
                if (file) {
                    file.issues.push(i.key);
                    file.count++;
                } else {
                    file = { count: 1, issues: [i.key] };
                }
                files.set(f, file)
            })
        } else {
            noMatchCount++;
        }
    });

    return {
        matchCount: matchCount,
        noMatchCount: noMatchCount,
        files: files
    }
}

async function getCauses() {

    let issues = await getIssues();
    let commits = await getCommits();

    return joinIssuesAndCommits(issues, commits);
}

async function test() {
    const join = await getCauses();
    console.log(join.matchCount);
    console.log(join.noMatchCount);
    const arr = [...join.files.entries()]
    arr.sort((a, b) => b[1].count - a[1].count)
    arr.forEach(a => console.log(a[0], a[1].count, a[1].issues))
}
//test();

module.exports = getCauses;
