/* ===== STORAGE ===== */
const DATA_KEY = "absen_marhamah";
const DEVICE_KEY = "perangkat_sudah_absen";

let data = JSON.parse(localStorage.getItem(DATA_KEY)) || [];
let role = "";
let chartObj = null;

/* ===== AKUN ===== */
const users = {
  admin: btoa("adminmarhamah"),
  panitia: btoa("panitia2025"),
};

/* ===== KELAS ===== */
function updateKelas() {
  isiKelas("jenjang", "kelas");
}

function updateBKelas() {
  isiKelas("bJenjang", "bKelas");
}

function isiKelas(jenjangId, kelasId) {
  const jenjang = document.getElementById(jenjangId).value;
  const kelas = document.getElementById(kelasId);
  kelas.innerHTML = '<option value="">Pilih Kelas</option>';

  if (jenjang === "SD") {
    for (let i = 1; i <= 6; i++) {
      kelas.innerHTML += `<option value="Kelas ${i}">Kelas ${i}</option>`;
    }
  }

  if (jenjang === "SMP") {
    for (let i = 7; i <= 9; i++) {
      kelas.innerHTML += `<option value="Kelas ${i}">Kelas ${i}</option>`;
    }
  }
}

/* ===== CEK GANDA ===== */
function sudahAbsen(n, j, k) {
  return data.some(
    (d) =>
      d.nama.toLowerCase() === n.toLowerCase() &&
      d.jenjang === j &&
      d.kelas === k
  );
}

/* ===== ABSEN SISWA ===== */
function absen() {
  if (localStorage.getItem(DEVICE_KEY)) {
    info.innerText = "❌ Perangkat ini sudah digunakan";
    return;
  }

  const n = nama.value.trim();
  const j = jenjang.value;
  const k = kelas.value;

  if (!n || !j || !k) {
    info.innerText = "❌ Lengkapi data";
    return;
  }

  if (sudahAbsen(n, j, k)) {
    info.innerText = "❌ Sudah absen";
    return;
  }

  data.push({
    nama: n,
    jenjang: j,
    kelas: k,
    waktu: new Date().toLocaleString(),
  });
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
  localStorage.setItem(DEVICE_KEY, "true");

  info.innerText = "✅ Absen berhasil";
  updateDashboard();
}

/* ===== LOGIN ===== */
function login() {
  const u = user.value;
  const p = btoa(pass.value);

  if (users[u] === p) {
    role = u;
    dashboard.classList.remove("hidden");
    bantuBox.classList.remove("hidden");
    if (role === "admin") resetBtn.classList.remove("hidden");
    updateDashboard();
    alert("Login sebagai " + role);
  } else {
    alert("❌ Login gagal");
  }
}

/* ===== BANTU ABSEN ===== */
function bantuAbsen() {
  const n = bNama.value.trim();
  const j = bJenjang.value;
  const k = bKelas.value;

  if (!n || !j || !k) return alert("Lengkapi data");
  if (sudahAbsen(n, j, k)) return alert("❌ Sudah absen");

  data.push({
    nama: n,
    jenjang: j,
    kelas: k,
    waktu: new Date().toLocaleString(),
    bantu: true,
  });
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
  alert("✅ Absen tersimpan");
  updateDashboard();
}

/* ===== DASHBOARD ===== */
function updateDashboard() {
  const sd = data.filter((d) => d.jenjang === "SD").length;
  const smp = data.filter((d) => d.jenjang === "SMP").length;
  rekap.innerText = `Total: ${data.length} | SD: ${sd} | SMP: ${smp}`;

  if (chartObj) chartObj.destroy();
  chartObj = new Chart(chart, {
    type: "bar",
    data: {
      labels: ["SD", "SMP"],
      datasets: [{ data: [sd, smp] }],
    },
  });
}

/* ===== DOWNLOAD ===== */
function download() {
  let csv = "Nama,Jenjang,Kelas,Waktu\n";
  data.forEach((d) => {
    csv += `${d.nama},${d.jenjang},${d.kelas},${d.waktu}\n`;
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "absen_marhamah.csv";
  a.click();
}

/* ===== RESET ===== */
function resetData() {
  if (role !== "admin") return;
  if (confirm("Hapus semua data?")) {
    localStorage.clear();
    data = [];
    updateDashboard();
  }
}
