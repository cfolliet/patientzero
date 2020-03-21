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
    const response = await fetch(url).catch(error => {
        alert(error);
    });
    if(!response.ok){
        alert(response);
    }
    data = await response.json();
    refreshCauses();
    localStorage.setItem('config', JSON.stringify({ workingDir, host, email, token, since, boardId, projectKey, keyFormat }))
}

function refreshCauses() {
    var templateRow = document.querySelector('#causeRow');
    var templateIssue = document.querySelector('#issue');
    const nbCauses = document.getElementById('nbCauses');
    const nbBugs = document.getElementById('nbBugs');
    const nbDays = document.getElementById('nbDays');
    const nbFiles = document.getElementById('nbFiles');
    const causefiles = document.getElementById('causefiles');
    causefiles.innerHTML = '';
    nbCauses.innerText = data.matchCount;
    nbBugs.innerText = data.bugCount;
    nbDays.innerText = document.getElementById('since').value;
    nbFiles.innerText = data.files.length;
    let index = 0;
    const tooltips = [];
    data.files.forEach(file => {
        const issues = file[1].issues.map(i => {
            index++;
            const issue = templateIssue.content.cloneNode(true);
            const link = issue.querySelector('.link');
            link.setAttribute('id', index);
            link.setAttribute('href', 'https://talentsoft.atlassian.net/browse/' + i.key);
            link.innerText = i.key;
            const tooltip = issue.querySelector('.mdl-tooltip');
            tooltip.setAttribute('for', index);
            tooltip.innerText = i.summary;
            tooltips.push(tooltip);
            return issue;
        });

        var li = templateRow.content.cloneNode(true);
        li.querySelector('.file').textContent = file[0];
        //li.querySelectorAll('.count')[0].textContent = file[1].count;
        issues.forEach(i => {
            li.querySelector('.issues').appendChild(i);
        });
        causefiles.appendChild(li);
    });
    tooltips.forEach(t => componentHandler.upgradeElement(t))
}

function bind() {
    const loadBt = document.getElementById('load');
    loadBt.addEventListener('click', async () => {
        loadBt.setAttribute("disabled", "");
        loadBt.innerText = 'loading...';
        await getData();
        loadBt.innerText = 'load';
        loadBt.removeAttribute("disabled", "");
    });
}

async function main() {
    setConfig();
    bind();
}

main();