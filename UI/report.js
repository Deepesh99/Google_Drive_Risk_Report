const publicFiles = document.querySelectorAll(".public-files-value")
const accessFiles = document.querySelectorAll(".people-with-access-value")
const sharedFiles = document.querySelectorAll(".shared-external-value")
const riskScore = document.querySelectorAll(".risk-score-value");
const publicTable = document.querySelectorAll(".public-access-list-value");
const sharedTable = document.querySelectorAll(".shared-external-list-value");
const btn = document.querySelectorAll("button");
let table1 = document.createElement('table');
let table2 = document.createElement('table');
const loc = window.location.pathname;
const dir = loc.substring(0, loc.lastIndexOf('/'));

btn[0].onclick = function() {
    const email = document.getElementById("email").value 
    
    console.log(dir);
    fetch('http://localhost:3000/drive', {
    headers:{
        // 'email': 'deepesh99.nair@gmail.com'
        email
    }
})
.then( res => {
    return res.json();
})
.then( data => {
    console.log(data);
    // console.log(data[0].sharedExternally)
    sharedFiles[0].textContent = data[0].sharedExternally;
    publicFiles[0].textContent = data[1].publicFiles;
    accessFiles[0].textContent = data[2].peopleWithAccess;
    riskScore[0].textContent = data[3].riskScore;
    console.log(data[4].PublicFiles.length);
    
    let row1 = document.createElement('tr');
        let th1 = document.createElement('th');
        let th2 = document.createElement('th');
        let th3 = document.createElement('th');
        let th4 = document.createElement('th');
        th1.innerHTML= "File Name"
        row1.appendChild(th1);
        th2.innerHTML= "Acsess Setting"
        row1.appendChild(th2);
        th3.innerHTML= "Shared with"
        row1.appendChild(th3);
        th4.innerHTML= "Created By"
        row1.appendChild(th4);
        table1.appendChild(row1);

    for(let i=0; i< data[4].PublicFiles.length; i++) {
        let row = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        td1.innerHTML= JSON.stringify(data[4].PublicFiles[i].fileName).replace(/['"]+/g, '');
        row.appendChild(td1);
        td2.innerHTML= JSON.stringify(data[4].PublicFiles[i].accessSetting).replace(/['"]+/g, '');
        row.appendChild(td2);
        td3.innerHTML= JSON.stringify(data[4].PublicFiles[i].sharedWith[0].name).replace(/['"]+/g, '');
        row.appendChild(td3);
        td4.innerHTML= JSON.stringify(data[4].PublicFiles[i].createdBy[0].name).replace(/['"]+/g, '');
        row.appendChild(td4);
        table1.appendChild(row);
    }
    publicTable[0].appendChild(table1);


    let row2 = document.createElement('tr');
    let th21 = document.createElement('th');
    let th22 = document.createElement('th');
    let th23 = document.createElement('th');
    let th24 = document.createElement('th');
    th21.innerHTML= "File Name"
    row2.appendChild(th21);
    th22.innerHTML= "Acsess Setting"
    row2.appendChild(th22);
    th23.innerHTML= "Shared with"
    row2.appendChild(th23);
    th24.innerHTML= "Created By"
    row2.appendChild(th24);
    table2.appendChild(row2);

for(let i=0; i< data[5].sharedExternally.length; i++) {
    let row = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    td1.innerHTML= JSON.stringify(data[5].sharedExternally[i].fileName).replace(/['"]+/g, '');
    row.appendChild(td1);
    td2.innerHTML= JSON.stringify(data[5].sharedExternally[i].accessSetting).replace(/['"]+/g, '');
    row.appendChild(td2);
    td3.innerHTML= JSON.stringify(data[5].sharedExternally[i].sharedWith[0].name).replace(/['"]+/g, '');
    row.appendChild(td3);
    td4.innerHTML= JSON.stringify(data[5].sharedExternally[i].createdBy[0].name).replace(/['"]+/g, '');
    row.appendChild(td4);
    table2.appendChild(row);
}
sharedTable[0].appendChild(table2);
})
.catch(err => {
    window.location.href = dir + "/404.html";
    // window.location.href = `${dir}` + "/404.html";
})
};

btn[1].onclick = function() {
    const email = document.getElementById("email").value 
    console.log(email);
    fetch('http://localhost:3000/revoke', {
    headers:{
        // 'email': 'deepesh99.nair@gmail.com'
        email
    }
})
.then( res => {
    return res.text();
})
.then( data => {
    console.log(data);
})   
}