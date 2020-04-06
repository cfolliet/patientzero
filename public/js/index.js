let data = null;

const FRONT = ['html', 'js', 'cshtml', 'tsx', 'ts', 'css', 'less']
const BACK = ['cs', 'config', 'resx', 'csproj', 'xml', 'sql']

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

    if (response.ok) {
        data = await response.json();
        data.testFiles = [];
        data.codeExtentionFiles = {};
        data.frontFiles = [];
        data.backFiles = [];
        data.otherFiles = [];
        data.files.forEach(f => {
            if (f[0].toLowerCase().includes('tests')) {
                data.testFiles.push(f);
            } else {
                const extension = f[0].split('.').pop();
                if (FRONT.includes(extension)) {
                    data.frontFiles.push(f);
                } else if (BACK.includes(extension)) {
                    data.backFiles.push(f);
                } else {
                    data.otherFiles.push(f);
                }
            }
        });

        [...data.frontFiles, ...data.backFiles, ...data.otherFiles].forEach(f => {
            const extension = f[0].split('.').pop();
            const previousCount = data.codeExtentionFiles[extension] || 0;
            data.codeExtentionFiles[extension] = previousCount + 1;
        });

        refreshCauses();
        localStorage.setItem('config', JSON.stringify({ workingDir, host, email, token, since, boardId, projectKey, keyFormat }));
    } else {
        var notification = document.querySelector('.mdl-js-snackbar');
        notification.MaterialSnackbar.showSnackbar(
            {
                message: data,
                timeout: 5000
            }
        );
    }
}

function drawTestChart(testCount, codeCount) {
    let data = {
        datasets: [{
            data: [codeCount, testCount],
            backgroundColor: [
                'rgb(63,81,181)',
                '#e91e63'
            ],
        }],
        labels: [
            'Code files',
            'Test files'
        ]
    };

    let options = {
        title: {
            display: true,
            text: 'Code VS Test Files'
        }
    };

    let ctx = document.getElementById('testChart');
    let testChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}


function drawExtensionChart(datasource) {
    let data = {
        datasets: [{
            data: Object.values(datasource.codeExtentionFiles),
            backgroundColor: [
                '#f44336',
                '#9C27B0',
                '#3F51B5',
                '#009688',
                '#FF9800',
                '#9E9E9E',
                '#607D8B',
                '#FF5722',
                '#FFEB3B',
                '#2196F3',
                '#673AB7',
                '#E91E63',
            ],
            labels: Object.keys(datasource.codeExtentionFiles)
        },
        {
            data: [datasource.frontFiles.length, datasource.backFiles.length, datasource.otherFiles.length],
            labels: ['Client side', 'Server side', 'Other'],
            backgroundColor: [
                'rgb(63,81,181)',
                '#e91e63'
            ]
        }],
        labels: Object.keys(datasource.codeExtentionFiles)
    };

    let options = {
        title: {
            display: true,
            text: 'File Extensions'
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var index = tooltipItem.index;
                    return dataset.labels[index] + ': ' + dataset.data[index];
                }
            }
        }
    };

    let ctx = document.getElementById('extensionChart');
    let testChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

function refreshCauses() {
    let templateRow = document.querySelector('#causeRow');
    let templateIssue = document.querySelector('#issue');
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
        issues.forEach(i => {
            li.querySelector('.issues').appendChild(i);
        });
        causefiles.appendChild(li);
    });
    tooltips.forEach(t => componentHandler.upgradeElement(t))

    drawTestChart(data.testFiles.length, data.frontFiles.length + data.backFiles.length + data.otherFiles.length);
    drawExtensionChart(data);
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