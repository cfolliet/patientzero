const simpleGit = require('simple-git/promise');
const git = simpleGit('F:\\Workspace\\hellotalent');

async function getCommits() {
  const logs = await git.raw(
    [
      'log',
      '--since="365 days"',
      '--grep=HT-',
      '--name-only',
      '--pretty=short',
      '-m'
    ]);
  let commits = logs.split(/(?=commit )/).map(c => c.split('\n'));
  //commits = commits.filter(c => c[1].startsWith('Merge') && c[4].trim().startsWith('Merged')); // keep only merge commit
  commits = commits.map(c => {
    return {
      message: c[3].trim() + c[4].trim(),
      files: c.slice(5).filter(f => f.length)
    };
  });
  return commits;
}

async function test() {
  const commits = await getCommits()
  console.log(commits)
}
//test();

module.exports = getCommits;