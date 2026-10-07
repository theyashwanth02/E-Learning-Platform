function setMessage(text, ok = false) {
    const el = document.getElementById("loginMessage");
    if (!el) return;
    el.textContent = text;
    el.style.color = ok ? "#15803d" : "#dc2626";
}

function login() {
    const username = (document.getElementById("username")?.value || "").trim().toLowerCase();
    const password = document.getElementById("password")?.value || "";
    const role = document.getElementById("role")?.value || "student";

    if (!username || !password) {
        setMessage("Please enter username and password.");
        return;
    }

    if (role === "student" && username === "yashwanth" && password === "1234") {
        localStorage.setItem("userRole", "student");
        localStorage.setItem("username", "yashwanth");
        window.location.href = "dashboard.html";
        return;
    }

    if (role === "faculty" && username === "faculty" && password === "1234") {
        localStorage.setItem("userRole", "faculty");
        localStorage.setItem("username", "faculty");
        window.location.href = "faculty.html";
        return;
    }

    setMessage("Invalid username, password or selected role.");
}

function logout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    window.location.href = "index.html";
}

function requireRole(pageRole) {
    const role = localStorage.getItem("userRole");
    if (!role) {
        window.location.href = "index.html";
        return false;
    }
    if (pageRole && role !== pageRole) {
        window.location.href = role === "faculty" ? "faculty.html" : "dashboard.html";
        return false;
    }
    return true;
}

function updateStudentName() {
    const username = localStorage.getItem("username") || "Yashwanth";
    const pretty = username.charAt(0).toUpperCase() + username.slice(1);
    const name = document.getElementById("welcomeName");
    const profileName = document.getElementById("profileName");
    const initial = document.getElementById("profileInitial");
    if (name) name.textContent = pretty;
    if (profileName) profileName.textContent = pretty;
    if (initial) initial.textContent = pretty.charAt(0).toUpperCase();
}

function getQuizScore() {
    return Number(localStorage.getItem("quizScore") || 82);
}

function setQuizScore(score) {
    localStorage.setItem("quizScore", String(score));
}

function calculateOverall() {
    const quiz = getQuizScore();
    const assignments = 75;
    const progress = 80;
    const finalAssessment = 76;
    return Math.round(quiz * 0.30 + assignments * 0.30 + progress * 0.20 + finalAssessment * 0.20);
}

function updatePerformanceValues() {
    const quiz = getQuizScore();
    const overall = calculateOverall();

    const avgQuiz = document.getElementById("avgQuiz");
    const overallStat = document.getElementById("overallStat");
    if (avgQuiz) avgQuiz.textContent = quiz + "%";
    if (overallStat) overallStat.textContent = overall + "%";

    const score = document.getElementById("performanceScore");
    const donutScore = document.getElementById("donutScore");
    const quizScore = document.getElementById("quizScore");
    const quizBar = document.getElementById("quizBar");
    const donut = document.getElementById("performanceDonut");

    if (score) score.textContent = overall + "%";
    if (donutScore) donutScore.textContent = overall + "%";
    if (quizScore) quizScore.textContent = quiz + "%";
    if (quizBar) quizBar.style.width = quiz + "%";
    if (donut) donut.style.setProperty("--value", overall);
}

function submitQuiz() {
    let score = 0;
    for (let i = 1; i <= 3; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected?.value === "correct") score++;
    }

    const percentage = Math.round((score / 3) * 100);
    setQuizScore(percentage);

    const result = document.getElementById("quizResult");
    if (result) {
        result.style.display = "block";
        result.innerHTML = `Quiz submitted successfully! Score: <strong>${score}/3 (${percentage}%)</strong>. Your performance has been updated.`;
    }
}

function submitAssignment(name) {
    alert(`${name} submitted successfully! In the full system, the file would be stored and sent to faculty for evaluation.`);
    localStorage.setItem("assignmentSubmitted", "true");
}

function viewFeedback(name) {
    alert(`Faculty feedback for "${name}": Good work. Continue improving your explanation and practical examples.`);
}

function watchLecture() {
    alert("Lecture player placeholder: Java OOP lecture would open here.");
}

function studyMaterial() {
    alert("Study material placeholder: PDF/notes would open here.");
}

function filterStudents(filter) {
    document.querySelectorAll("#studentTable tbody tr").forEach(row => {
        const score = Number(row.dataset.score || 0);
        let show = true;
        if (filter === "high") show = score >= 80;
        if (filter === "support") show = score < 70;
        row.style.display = show ? "" : "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    if (page === "student" && !requireRole("student")) return;
    if (page === "faculty" && !requireRole("faculty")) return;

    updateStudentName();
    updatePerformanceValues();
});
