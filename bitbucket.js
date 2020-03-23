const simpleGit = require('simple-git/promise');

async function getCommits(workingDir, since, keyFormat) {
  const git = simpleGit(workingDir);
  const logs = await git.raw(
    [
      'log',
      `--since="${since} days"`,
      `--grep=${keyFormat}`,
      '--name-only',
      '--pretty=short',
      '-m'
    ]);
  let commits = logs.split(/(?=commit )/).map(c => c.split('\n'));
  commits = commits.map(c => {
    const c3 = c[3] ? c[3].trim() : '';
    const c4 = c[4] ? c[4].trim() : '';
    return {
      message: c3 + c4,
      files: c.slice(5).filter(f => f.length)
    };
  });
  return commits;
}

async function test() {
  const commits = await getCommits(30, 'HT-')
  console.log(commits)
}
//test();

module.exports = getCommits;