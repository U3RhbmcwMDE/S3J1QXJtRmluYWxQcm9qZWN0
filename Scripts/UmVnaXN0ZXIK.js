document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("form");
    const apiUrl = "https://6799ffea747b09cdcccd4f8a.mockapi.io/product"; 
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const passwordConfirmInput = document.getElementById("passwordconfirm");
    const emailInput = document.getElementById("emailinput");
    const errorMessage = document.getElementById("error-message");

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (!usernameInput.value || !passwordInput.value || !passwordConfirmInput.value || !emailInput.value) {
            errorMessage.textContent = "กรุณากรอกข้อมูลให้ครบทุกช่อง!";
            return;
        }
        if (passwordInput.value !== passwordConfirmInput.value) {
            errorMessage.textContent = "รหัสผ่านไม่ตรงกัน!";
            return;
        }
        const userData = {
            username: usernameInput.value,
            password: passwordInput.value,
            email: emailInput.value
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "สมัครสมาชิกสำเร็จ!",
                    text: "คุณสามารถเข้าสู่ระบบได้เลย",
                    confirmButtonText: "ตกลง"
                }).then(() => {
                    window.location.href = "./index.html";
                });
            } else {
                throw new Error("สมัครสมาชิกไม่สำเร็จ");
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง",
                confirmButtonText: "ตกลง"
            });
        }
    });
});
