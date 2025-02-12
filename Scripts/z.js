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

function verifyJWT(token, secret) {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) {
        return { valid: false, reason: "Invalid token format" };
    }
    const validSignature = btoa(`${header}.${body}.${secret}`);
    if (signature !== validSignature) {
        return { valid: false, reason: "Invalid signature" };
    }
    let payload;
    try {
        payload = JSON.parse(atob(body));
    } catch (error) {
        return { valid: false, reason: "Invalid payload format" };
    }
    if (Date.now() / 1000 > payload.exp) {
        return { valid: false, reason: "Token expired" };
    }
    return { valid: true, payload };
}

function chktoken() {
    const token = localStorage.getItem("token");
    if (!token) {
        FirePopup("ไม่พบโทเคน | ล็อคอินใหม่ !", "error", "โอเค")
        sleep(2000).then(() => { window.location.href = "./index.html"; });
        return { valid: false }
    }
    const result = verifyJWT(token, "mysecret");
    if (!result.valid) {
        if (result.reason === "Token expired") {
            FirePopup("โทเคนหมดอายุ | ล็อคอินใหม่ !", "error", "โอเค")
            localStorage.removeItem("token");
            sleep(2000).then(() => { window.location.href = "./index.html"; });
            return { valid: false }
        } else {
            FirePopup("โทเคนผิด | ล็อคอินใหม่ !", "error", "โอเค")
            sleep(2000).then(() => { window.location.href = "./index.html"; });
            return { valid: false }
        }
    } else {
        return { valid: true }
    }
}