const students = [
  { name: 'Aarav Sharma', email: 'aarav@gmail.com', branch: 'CSE', course: 'BCA', gpa: 8.7, status: 'Active', photo: 'https://i.pravatar.cc/100?img=11' },
  { name: 'Priya Verma', email: 'priya@gmail.com', branch: 'IT', course: 'BTech', gpa: 8.9, status: 'Active', photo: 'https://i.pravatar.cc/100?img=32' },
  { name: 'Rahul Singh', email: 'rahul@gmail.com', branch: 'ECE', course: 'MCA', gpa: 7.8, status: 'Inactive', photo: 'https://i.pravatar.cc/100?img=15' },
  { name: 'Sana Khan', email: 'sana@gmail.com', branch: 'CSE', course: 'BSc', gpa: 9.1, status: 'Active', photo: 'https://i.pravatar.cc/100?img=47' },
  { name: 'Karan Mehta', email: 'karan@gmail.com', branch: 'Mechanical', course: 'BTech', gpa: 7.5, status: 'Inactive', photo: 'https://i.pravatar.cc/100?img=54' }
];

const table = document.getElementById('studentTable');
const searchInput = document.getElementById('searchInput');
const branchFilter = document.getElementById('branchFilter');
const courseFilter = document.getElementById('courseFilter');
const statusFilter = document.getElementById('statusFilter');
const totalStudents = document.getElementById('totalStudents');
const activeStudents = document.getElementById('activeStudents');
const avgGpa = document.getElementById('avgGpa');

function fillFilters() {
  const branches = [...new Set(students.map(s => s.branch))];
  const courses = [...new Set(students.map(s => s.course))];
  branches.forEach(b => branchFilter.innerHTML += `<option value="${b}">${b}</option>`);
  courses.forEach(c => courseFilter.innerHTML += `<option value="${c}">${c}</option>`);
}

function renderTable() {
  const q = searchInput.value.toLowerCase();
  const branch = branchFilter.value;
  const course = courseFilter.value;
  const status = statusFilter.value;

  const filtered = students.filter(s => {
    const matchSearch = [s.name, s.email, s.branch, s.course].some(v => v.toLowerCase().includes(q));
    const matchBranch = branch === 'all' || s.branch === branch;
    const matchCourse = course === 'all' || s.course === course;
    const matchStatus = status === 'all' || s.status === status;
    return matchSearch && matchBranch && matchCourse && matchStatus;
  });

  table.innerHTML = filtered.map(s => `
    <tr>
      <td><img class="photo" src="${s.photo}" alt="${s.name}"></td>
      <td>${s.name}</td>
      <td>${s.email}</td>
      <td>${s.branch}</td>
      <td>${s.course}</td>
      <td>${s.gpa}</td>
      <td><span class="badge ${s.status.toLowerCase()}">${s.status}</span></td>
    </tr>
  `).join('');

  totalStudents.textContent = filtered.length;
  activeStudents.textContent = filtered.filter(s => s.status === 'Active').length;
  avgGpa.textContent = filtered.length ? (filtered.reduce((a, b) => a + b.gpa, 0) / filtered.length).toFixed(1) : '0.0';
}

[searchInput, branchFilter, courseFilter, statusFilter].forEach(el => el.addEventListener('input', renderTable));
fillFilters();
renderTable();

document.getElementById('addStudentBtn').addEventListener('click', () => {
  alert('You can add a form here if your teacher wants extra functionality.');
});