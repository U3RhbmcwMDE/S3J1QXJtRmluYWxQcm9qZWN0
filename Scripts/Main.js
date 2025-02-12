const loginBtn = document.getElementById('login-btn');
const errorMessage = document.getElementById('error-message');
const apiUrl = "https://6799ffea747b09cdcccd4f8a.mockapi.io/product";

function FirePopup(a, b, c) {
    Swal.fire({
        text: a,
        icon: b,
        confirmButtonText: c
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function newjwt(payload, secret, expireinsec = 9999) {
    const header = btoa(JSON.stringify({
        alg: "HS256",
        typ: "JWT"
    }));
    const body = btoa(JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + expireinsec
    }));
    const signature = btoa(`${header}.${body}.${secret}`);
    return `${header}.${body}.${signature}`;
}
loginBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!username || !password) {
        FirePopup('ใส่ Username และ Password', 'error', 'Okay');
        errorMessage.textContent = "ใส่ Username และ Password";
        return;
    }
    try {
        const response = await fetch(`${apiUrl}?username=${username}`);
        const users = await response.json();
        if (users.length === 0) {
            FirePopup('Username ไม่ถูก', 'error', 'Okay');
            errorMessage.textContent = "Username ไม่ถูก";
            return;
        }
        const user = users[0];
        if (user.password === password) {
            errorMessage.textContent = "เข้าสู่ระบบสำเร็จ !";
            const token = newjwt({ username: user.username }, "mysecret", 9999)
            localStorage.setItem("token", token)
            localStorage.setItem("username", user.username)
            localStorage.setItem("email", user.email)
            FirePopup('เข้าสู่ระบบสำเร็จ !', 'success', 'Okay');
            sleep(1000).then(() => { window.location.href = "./Homepage.html"; });
        } else {
            FirePopup('Password / Username ไม่ถูกต้อง', 'error', 'Okay');
            errorMessage.textContent = "Password / Username ไม่ถูก";
        }
    } catch (error) {
        console.error(error);
        errorMessage.textContent = "Mock ไม่ response";
    }
})