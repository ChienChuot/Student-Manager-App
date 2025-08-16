//real-time nav
const realTime = document.getElementById("nav-date");
function currentDate() {
  realTime.textContent = new Date().toLocaleString();
}

setInterval(currentDate, 1000);

// 1) Lấy phần tử DOM
const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentAge = document.getElementById("studentAge");
const studentScore = document.getElementById("studentScore");
const searchInput = document.getElementById("searchInput");
const filterScore = document.getElementById("filterScore");
const studentList = document.getElementById("studentList");

// 2) LocalStorage
function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

// 3) Trạng thái tìm kiếm/lọc
// let currentSearch = "";
// let currentFilter = "all";

// 4) Render danh sách sinh viên
function renderStudents(filteredStudents = null) {
  studentList.innerHTML = "";
  const students = filteredStudents || getStudents();
  students.forEach((student, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <h3>Tên: ${student.name}</h3>
        <p>Tuổi: ${student.age}</p>
        <p>Điểm trung bình: ${student.score}</p>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
        `;
    studentList.appendChild(li);
  });
}

// 5) Thêm sinh viên
function addStudent() {
  const name = studentName.value.trim();
  const age = studentAge.value.trim();
  const score = studentScore.value.trim();

  if (!name || !age || !score) {
    alert("Vui lòng nhập đầy đủ thông tin Student");
    return;
  }

  const students = getStudents();
  const newStudent = {
    name: name,
    age: parseFloat(age),
    score: parseFloat(score),
  };

  students.push(newStudent);
  saveStudents(students);

  studentName.value = "";
  studentAge.value = "";
  studentScore.value = "";
  renderStudents();
}

// 6) Xoá sinh viên
function deleteStudent(index) {
  const students = getStudents();
  students.splice(index, 1);
  saveStudents(students);
  renderStudents();
}

// 7) Sửa sinh viên
function editStudent(index) {
  const students = getStudents();
  const newName = prompt("Nhập tên mới:", students[index].name);
  const newAge = prompt("Nhập tuổi mới:", students[index].age);
  const newScore = prompt("Nhập điểm mới:", students[index].score);

  if (newName && newAge && newScore) {
    students[index] = {
      name: newName,
      age: parseFloat(newAge),
      score: parseFloat(newScore),
    };
    saveStudents(students);
    renderStudents();
  }
}

// 8) Sự kiện submit form
studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addStudent();
});

// 9) Sự kiện tìm kiếm
searchInput.addEventListener("input", function () {
  const searchTerm = this.value.trim().toLowerCase();
  const students = getStudents();

  const filtered = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm) ||
      student.age.toString().includes(searchTerm)
  );
  renderStudents(filtered);
});

// 10) Sự kiện lọc học lực
filterScore.addEventListener("change", function () {
  const filterValue = this.value;
  const students = getStudents();
  let filtered = [];

  if (filterValue === "all") {
    filtered = students;
  } else if (filterValue === "good") {
    filtered = students.filter((student) => student.score >= 8.0);
  } else if (filterValue === "weak") {
    filtered = students.filter((student) => student.score < 5);
  }
  renderStudents(filtered);
});

// 11) Sự kiện Edit/Delete (Event Delegation)
studentList.addEventListener("click", function (e) {
  const clicked = e.target;

  if (clicked.classList.contains("delete-btn")) {
    const index = clicked.dataset.index;
    deleteStudent(index);
  } else if (clicked.classList.contains("edit-btn")) {
    const index = clicked.dataset.index;
    editStudent(index);
  }
});

renderStudents();
