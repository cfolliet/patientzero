let data = null;

function setConfig() {
    const raw = localStorage.getItem('config');
    if (raw) {
        const config = JSON.parse(raw);
        document.getElementById('workingDir').value = config.workingDir;
        document.getElementById('host').value = config.host;
        document.getElementById('email').value = config.email;
        document.getElementById('token').value = config.token;
        document.getElementById('since').value = config.since;
        document.getElementById('boardId').value = config.boardId;
        document.getElementById('projectKey').value = config.projectKey;
        document.getElementById('keyFormat').value = config.keyFormat;
    }
}

async function getData() {
    const workingDir = document.getElementById('workingDir').value;
    const host = document.getElementById('host').value;
    const email = document.getElementById('email').value;
    const token = document.getElementById('token').value;
    const since = document.getElementById('since').value;
    const boardId = document.getElementById('boardId').value;
    const projectKey = document.getElementById('projectKey').value;
    const keyFormat = document.getElementById('keyFormat').value;
    const url = encodeURI(`/api/getdata?workingDir=${workingDir}&host=${host}&email=${email}&token=${token}&since=${since}&boardId=${boardId}&projectKey=${projectKey}&keyFormat=${keyFormat}`);
    const response = await fetch(url);
    data = await response.json();
    refreshCauses();
    localStorage.setItem('config', JSON.stringify({ workingDir, host, email, token, since, boardId, projectKey, keyFormat }))
}

function refreshCauses() {
    const nbCauses = document.getElementById('nbCauses');
    const nbNoCauses = document.getElementById('nbNoCauses');
    const causefiles = document.getElementById('causefiles');
    nbCauses.innerText = `Bug with commits: ${data.matchCount}`;
    nbNoCauses.innerText = `Bug without commits: ${data.noMatchCount}`;;
    data.files.forEach(file => {
        const issues = file[1].issues.map(i => '<a href="https://talentsoft.atlassian.net/browse/' + i.key + '" title="' + i.summary + '">' + i.key + '</a>').join('|');
        const li = document.createElement('li');
        let text = `<span class="file">${file[0]}</span>`;
        text += `<span class="count">${file[1].count}</span>`;
        text += `<span class="issues">${issues}</span>`;
        li.innerHTML = text;
        causefiles.appendChild(li);
    });
}

function bind() {
    const loadBt = document.getElementById('load');
    loadBt.addEventListener('click', async () => {
        loadBt.innerText = 'loading...';
        await getData();
        loadBt.innerText = 'load';
    });
}

async function main() {
    setConfig();
    bind();
}

main();