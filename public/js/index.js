async function main(){
    const response = await fetch('/api/getdata');
    const data = await response.json();
    console.log(data)
}

main();