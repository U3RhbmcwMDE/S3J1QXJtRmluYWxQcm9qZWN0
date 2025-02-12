const name = localStorage.getItem("username");
const email = localStorage.getItem("email");

document.getElementById("checktoken")
    .addEventListener("click", function () {
        const token = localStorage.getItem("token");
        if (!token) {
            FirePopup("ไม่พบโทเคน | ล็อคอินใหม่ !", "error", "โอเค")
            sleep(2000).then(() => { window.location.href = "./index.html"; });
            return;
        }
        const result = verifyJWT(token, "mysecret");
        if (!result.valid) {
            if (result.reason === "Token expired") {
                FirePopup("โทเคนหมดอายุ | ล็อคอินใหม่ !", "error", "โอเค")
                localStorage.removeItem("token");
            } else {
                FirePopup("โทเคนผิด | ล็อคอินใหม่ !", "error", "โอเค")
            }
            sleep(2000).then(() => { window.location.href = "./index.html"; });
        } else {
            FirePopup("โทเคนถูกต้อง ! ยินดีต้อนรับ , " + result.payload.username, "success", "โอเค");
        }
    });
document.getElementById("logoutBtn")
    .addEventListener("click", function () {
        if (!chktoken().valid) { return }
        localStorage.removeItem("token");
        FirePopup("ออกจากระบบ เสร็จสิ้น !", "success", "โอเค")
        sleep(1000).then(() => { window.location.href = "./index.html"; });
    });
    setInterval(chktoken,1000)