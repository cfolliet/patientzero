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

function getViewmodel() {
    async function loadData() {
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
        this.data = await response.json();

        // trick waiting to have for in for with alpinejs
        this.issues = this.data.files.map(file => file[1].issues);
        console.log(this.issues)

        localStorage.setItem('config', JSON.stringify({ workingDir, host, email, token, since, boardId, projectKey, keyFormat }));
    }

    return {
        data: null,
        issues: [],
        loadData: loadData
    }
}

setConfig();