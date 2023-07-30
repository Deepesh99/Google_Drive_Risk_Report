const btn = document.querySelector("button");


btn.onclick = function() {
    fetch('http://localhost:3000/auth/google', {
})
.then( res => {
    return res.text();
})
.then( data => {
console.log(data);
window.location.href = data;
})
};