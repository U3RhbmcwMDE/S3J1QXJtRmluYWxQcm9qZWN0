const apiUrl = "https://6799ffea747b09cdcccd4f8a.mockapi.io/product"
const studentForm = document.getElementById("student-form")
const studentTable = document.getElementById("student-table")
const searchInput = document.getElementById("search")
let deleteStudentId = null
const fetchStudents = async () => {
    try {
        const response = await fetch(apiUrl)
        const students = await response.json()
        renderStudents(students);
    } catch (error) {
        console.error("err อะไรไหนดูสิ้:", error)
    }
}
const renderStudents = (students) => {
    studentTable.innerHTML = students.map(student => `
        <tr class="student-row" data-name="${student.username.toLowerCase()}">
          <td>${student.username}</td>
          <td>${student.password}</td>
          <td>${student.email}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="openEditModal('${student.id}', '${student.username}', '${student.password}', '${student.email}')">Edit</button>
            <button class="btn btn-error btn-sm" onclick="openDeleteModal('${student.id}')">Delete</button>
          </td>
        </tr>
      `).join("")
}
studentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const email = document.getElementById("email").value
    const studentId = studentForm.dataset.id
    try {
        if (studentId) {
            await fetch(`${apiUrl}/${studentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email }),
            });
            delete studentForm.dataset.id;
        } else {
            await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email }),
            });
        }
        studentForm.reset()
        fetchStudents()
    } catch (error) {
        console.error(error)
    }
});
const openEditModal = (id, name, age, grade) => {
    document.getElementById("edit-username").value = name;
    document.getElementById("edit-password").value = age;
    document.getElementById("edit-email").value = grade;
    const editForm = document.getElementById("edit-student-form")
    editForm.onsubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: document.getElementById("edit-username").value,
                    password: document.getElementById("edit-password").value,
                    email: document.getElementById("edit-email").value
                }),
            });
            closeModal('edit-modal')
            fetchStudents()
        } catch (error) {
            console.error(error)
        }
    };
    document.getElementById("edit-modal").classList.add("modal-open");
}
const openDeleteModal = (id) => {
    deleteStudentId = id
    document.getElementById("delete-modal").classList.add("modal-open")
}
const closeModal = (modalId) => {
    document.getElementById(modalId).classList.remove("modal-open");
}
document.getElementById("confirm-delete").addEventListener("click", async () => {
    try {
        await fetch(`${apiUrl}/${deleteStudentId}`, {
            method: "DELETE",
        });
        closeModal('delete-modal')
        fetchStudents()
    } catch (error) {
        console.error(error)
    }
})
const filterStudents = () => {
    const query = searchInput.value.toLowerCase()
    const rows = document.querySelectorAll(".student-row")
    rows.forEach(row => {
        const name = row.dataset.name;
        row.style.display = name.includes(query) ? "" : "none";
    });
}
fetchStudents();
document.getElementById("coolcontainer").addEventListener("mouseover", async () => {
    document.getElementById("nature-sound").play()
})
document.querySelectorAll("input").forEach(input => {
    let clickCount = 0;
    input.addEventListener("mouseover", function () {
        if (clickCount < 3) {
            const randomX = Math.floor(Math.random() * (window.innerWidth - this.clientWidth));
            const randomY = Math.floor(Math.random() * (window.innerHeight - this.clientHeight));
            this.style.zIndex=1000
            this.placeholder="ไม่ให้กดหรอก"
            this.style.position = "absolute";
            this.style.left = `${randomX}px`;
            this.style.top = `${randomY}px`;
            clickCount++;
        } else {
            this.placeholder="หยอกเล่นกรอกได้ปกติ"
            this.style.position = "static";
        }
    });
});