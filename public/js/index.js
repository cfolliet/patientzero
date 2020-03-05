let data = null;

async function getData() {
    const response = await fetch('/api/getdata');
    data = await response.json();
    refreshCauses();
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
    bind();
}

main();