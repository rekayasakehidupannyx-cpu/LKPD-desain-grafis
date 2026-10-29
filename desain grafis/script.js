// State Application
let currentTheme = "theme-indigo";
let userRatingPemahaman = 0;
let uploadedBase64Data = null;
let uploadedFileName = "";
let uploadedMimeType = "";
let savedGasUrl = localStorage.getItem("lkpd_gas_url") || "";
let teacherPasscode = localStorage.getItem("lkpd_teacher_pin") || "1234";

// Interactive Design Simulator Logic
let currentSimBg = "#ffffff";
let currentSimText = "#0f172a";

function updateSimulatorCanvas() {
  const titleSize = document.getElementById("sim-title-size").value;
  const bodySize = document.getElementById("sim-body-size").value;

  document.getElementById("sim-canvas-title").style.fontSize = `${titleSize}px`;
  document.getElementById("sim-canvas-body").style.fontSize = `${bodySize}px`;

  document.getElementById("label-title-size").innerText = `${titleSize}px`;
  document.getElementById("label-body-size").innerText = `${bodySize}px`;
}

function setSimColor(bg, text) {
  currentSimBg = bg;
  currentSimText = text;

  const canvas = document.getElementById("sim-canvas");
  canvas.style.backgroundColor = bg;
  canvas.style.color = text;

  const status = document.getElementById("sim-contrast-status");
  if (bg === "#fef08a" && text === "#eab308") {
    status.className =
      "font-bold px-3 py-1 rounded-full bg-red-100 text-red-800";
    status.innerText = "⚠️ Kontras Buruk! Tulisan Sulit Dibaca";
  } else {
    status.className =
      "font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800";
    status.innerText = "✅ Sangat Baik & Mudah Dibaca";
  }
}

function toggleSimSticker(type) {
  const badge = document.getElementById("sim-canvas-badge");
  if (type === "star") {
    badge.innerText = "⭐ ACARA SPESIAL";
    badge.classList.toggle("hidden");
  } else if (type === "badge") {
    badge.innerText = "🏷️ LOMBA DESAIN";
    badge.classList.toggle("hidden");
  } else if (type === "light") {
    badge.innerText = "💡 IDE KREATIF";
    badge.classList.toggle("hidden");
  }
}

// Cek Jawaban Jodohkan (Match)
function cekJawabanMatch() {
  const q1 = document.getElementById("match-q1").value;
  const q2 = document.getElementById("match-q2").value;
  const q3 = document.getElementById("match-q3").value;
  const q4 = document.getElementById("match-q4").value;

  let skor = 0;
  if (q1 === "cmyk") skor++;
  if (q2 === "rgb") skor++;
  if (q3 === "tipografi") skor++;
  if (q4 === "vector") skor++;

  if (skor === 4) {
    showCustomNotification(
      "Hebat! Semua jawaban pencocokan istilah BENAR! (Skor: 4/4)",
      "success",
    );
  } else {
    showCustomNotification(
      `Kamu menjawab benar ${skor} dari 4 soal. Coba periksa kembali!`,
      "info",
    );
  }
}

// Modal Passcode Pemateri
function openGuruPasscodeModal() {
  document.getElementById("modal-passcode-guru").classList.remove("hidden");
  document.getElementById("input-passcode-guru").value = "";
  document.getElementById("input-passcode-guru").focus();
}

function closeGuruPasscodeModal() {
  document.getElementById("modal-passcode-guru").classList.add("hidden");
}

function verifyGuruPasscode() {
  const inputPin = document.getElementById("input-passcode-guru").value.trim();
  if (inputPin === teacherPasscode) {
    closeGuruPasscodeModal();
    toggleGuruEditorPanel(true);
    showCustomNotification("Akses Pemateri Berhasil Terverifikasi!", "success");
  } else {
    showCustomNotification("PIN Akses Salah! Silakan coba lagi.", "error");
  }
}

// Default Content Config
const defaultContent = {
  title: "LKPD Desain Grafis: Logo Inisial Nama",
  pengantar:
    '<p><strong>Logo Inisial (Monogram)</strong> adalah jenis logo yang menggunakan gabungan 1 hingga 3 huruf awal/inisial nama seseorang atau merk untuk menciptakan tanda identitas visual yang khas dan mudah diingat.</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-2"><div class="bg-white p-3 rounded-lg border border-slate-200 space-y-1"><span class="font-bold text-indigo-600 block"><i class="fa-solid fa-font"></i> 1. Pilih Huruf Inisial</span><p class="text-slate-600">Gunakan huruf depan dari nama depan dan nama belakangmu (Contoh: Budi Santoso ➔ <strong>BS</strong>).</p></div><div class="bg-white p-3 rounded-lg border border-slate-200 space-y-1"><span class="font-bold text-emerald-600 block"><i class="fa-solid fa-pen-nib"></i> 2. Eksplorasi Bentuk</span><p class="text-slate-600">Gabungkan atau tumpuk kedua huruf tersebut agar membentuk satu kesatuan gambar visual yang menarik.</p></div><div class="bg-white p-3 rounded-lg border border-slate-200 space-y-1"><span class="font-bold text-amber-600 block"><i class="fa-solid fa-fill-drip"></i> 3. Beri Warna Khas</span><p class="text-slate-600">Pilih 1 atau 2 warna kesukaanmu yang menggambarkan kepribadianmu (misal: Biru = Tenang, Merah = Berani).</p></div></div>',
  esai1:
    "1. Huruf inisial apa saja yang kamu pakai untuk membuat logomu? (Contoh: Huruf A dan R dari nama Ahmad Rifai)",
  esai2:
    "2. Warna apa yang kamu pilih untuk logomu, dan mengapa kamu menyukai warna tersebut?",
  esai3:
    "3. Bagaimana caramu menggabungkan huruf-huruf tersebut agar terlihat bagus? (Misal: disambungkan, ditumpuk, atau diberi bentuk lingkar)",
  esai4:
    "4. Menurutmu, kesan apa yang terlihat saat orang lain melihat logo inisial namamu? (Misal: Keren, Ceria, Rapi, atau Unik)",
  esai5:
    "5. Apa bagian yang paling menyenangkan saat kamu menggambar dan merancang logo inisial nama ini?",
};

// Rating Stars
function setPahamRating(score) {
  userRatingPemahaman = score;
  document.getElementById("nilai-pemahaman-siswa").value = score;

  document.querySelectorAll(".rate-star-btn").forEach((btn, index) => {
    const starIcon = btn.querySelector("i");
    if (index < score) {
      btn.classList.remove("bg-white", "text-slate-800", "border-slate-300");
      btn.classList.add("bg-amber-100", "text-amber-900", "border-amber-400");
      starIcon.classList.remove("text-slate-300");
      starIcon.classList.add("text-amber-500");
    } else {
      btn.classList.remove(
        "bg-amber-100",
        "text-amber-900",
        "border-amber-400",
      );
      btn.classList.add("bg-white", "text-slate-800", "border-slate-300");
      starIcon.classList.remove("text-amber-500");
      starIcon.classList.add("text-slate-300");
    }
  });
}

// Load saved data and local uploaded photo
window.addEventListener("DOMContentLoaded", () => {
  if (savedGasUrl) {
    const gasInput = document.getElementById("edit-gas-url");
    if (gasInput) gasInput.value = savedGasUrl;
  }

  try {
    const storedImageData = localStorage.getItem("lkpd_uploaded_logo_img");
    const storedFileName = localStorage.getItem("lkpd_uploaded_logo_filename");
    const storedMimeType = localStorage.getItem("lkpd_uploaded_logo_mimetype");

    if (storedImageData) {
      uploadedBase64Data = storedImageData;
      uploadedFileName = storedFileName || "logo-siswa.png";
      uploadedMimeType = storedMimeType || "image/png";

      const previewImg = document.getElementById("upload-img-preview");
      if (previewImg) previewImg.src = uploadedBase64Data;

      const fileInfo = document.getElementById("upload-file-info");
      if (fileInfo)
        fileInfo.textContent = `${uploadedFileName} (Tersimpan di LKPD)`;

      document.getElementById("upload-placeholder").classList.add("hidden");
      document
        .getElementById("upload-preview-container")
        .classList.remove("hidden");
    }
  } catch (err) {
    console.warn("Restore error:", err);
  }
});

// Handle File Upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showCustomNotification(
      "Harap pilih file bertipe gambar (JPG, PNG, WEBP)!",
      "error",
    );
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showCustomNotification("Ukuran file terlalu besar! Maksimal 5MB.", "error");
    return;
  }

  uploadedFileName = file.name;
  uploadedMimeType = file.type;

  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedBase64Data = e.target.result;

    const previewImg = document.getElementById("upload-img-preview");
    previewImg.src = uploadedBase64Data;

    document.getElementById("upload-file-info").textContent =
      `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    document.getElementById("upload-placeholder").classList.add("hidden");
    document
      .getElementById("upload-preview-container")
      .classList.remove("hidden");

    try {
      localStorage.setItem("lkpd_uploaded_logo_img", uploadedBase64Data);
      localStorage.setItem("lkpd_uploaded_logo_filename", uploadedFileName);
      localStorage.setItem("lkpd_uploaded_logo_mimetype", uploadedMimeType);
    } catch (err) {
      console.warn("Storage quota exceeded, displayed in preview only:", err);
    }

    showCustomNotification("Foto logo berhasil diunggah!", "success");
  };
  reader.readAsDataURL(file);
}

function removeUploadedFile() {
  document.getElementById("input-karya-file").value = "";
  uploadedBase64Data = null;
  uploadedFileName = "";
  uploadedMimeType = "";

  localStorage.removeItem("lkpd_uploaded_logo_img");
  localStorage.removeItem("lkpd_uploaded_logo_filename");
  localStorage.removeItem("lkpd_uploaded_logo_mimetype");

  document.getElementById("upload-img-preview").src = "#";
  document.getElementById("upload-placeholder").classList.remove("hidden");
  document.getElementById("upload-preview-container").classList.add("hidden");
}

// Toggle Panel Editor
function toggleGuruEditorPanel(forceShow = false) {
  const panel = document.getElementById("panel-editor-guru");
  if (!panel) return;

  if (forceShow || panel.classList.contains("hidden")) {
    panel.classList.remove("hidden");
    document.getElementById("edit-judul-lkpd").value =
      document.getElementById("header-title-text").innerText;
    document.getElementById("edit-pengantar-materi").value =
      document.getElementById("display-pengantar-materi").innerText;
    document.getElementById("edit-esai-1").value =
      document.getElementById("display-esai-1").innerText;
    document.getElementById("edit-esai-2").value =
      document.getElementById("display-esai-2").innerText;
    document.getElementById("edit-esai-3").value =
      document.getElementById("display-esai-3").innerText;
    document.getElementById("edit-esai-4").value =
      document.getElementById("display-esai-4").innerText;
    document.getElementById("edit-esai-5").value =
      document.getElementById("display-esai-5").innerText;
    if (savedGasUrl)
      document.getElementById("edit-gas-url").value = savedGasUrl;
    document.getElementById("edit-passcode-guru").value = teacherPasscode;
  } else {
    panel.classList.add("hidden");
  }
}

// Simpan Kustomisasi Guru
function simpanKustomisasiGuru() {
  const newTitle = document.getElementById("edit-judul-lkpd").value;
  const newPengantar = document.getElementById("edit-pengantar-materi").value;
  const newEsai1 = document.getElementById("edit-esai-1").value;
  const newEsai2 = document.getElementById("edit-esai-2").value;
  const newEsai3 = document.getElementById("edit-esai-3").value;
  const newEsai4 = document.getElementById("edit-esai-4").value;
  const newEsai5 = document.getElementById("edit-esai-5").value;
  const newGasUrl = document.getElementById("edit-gas-url").value.trim();
  const newPin = document.getElementById("edit-passcode-guru").value.trim();

  if (newTitle)
    document.getElementById("header-title-text").innerText = newTitle;
  if (newPengantar)
    document.getElementById("display-pengantar-materi").innerHTML =
      newPengantar;
  if (newEsai1) document.getElementById("display-esai-1").innerText = newEsai1;
  if (newEsai2) document.getElementById("display-esai-2").innerText = newEsai2;
  if (newEsai3) document.getElementById("display-esai-3").innerText = newEsai3;
  if (newEsai4) document.getElementById("display-esai-4").innerText = newEsai4;
  if (newEsai5) document.getElementById("display-esai-5").innerText = newEsai5;

  if (newGasUrl) {
    savedGasUrl = newGasUrl;
    localStorage.setItem("lkpd_gas_url", newGasUrl);
  }

  if (newPin) {
    teacherPasscode = newPin;
    localStorage.setItem("lkpd_teacher_pin", newPin);
  }

  showCustomNotification(
    "Materi, PIN Pemateri & URL Google Drive berhasil disimpan!",
    "success",
  );
}

// Reset Default
function resetMateriDefault() {
  document.getElementById("header-title-text").innerText = defaultContent.title;
  document.getElementById("display-pengantar-materi").innerHTML =
    defaultContent.pengantar;
  document.getElementById("display-esai-1").innerText = defaultContent.esai1;
  document.getElementById("display-esai-2").innerText = defaultContent.esai2;
  document.getElementById("display-esai-3").innerText = defaultContent.esai3;
  document.getElementById("display-esai-4").innerText = defaultContent.esai4;
  document.getElementById("display-esai-5").innerText = defaultContent.esai5;

  document.getElementById("edit-judul-lkpd").value = defaultContent.title;
  document.getElementById("edit-pengantar-materi").value =
    defaultContent.pengantar;
  document.getElementById("edit-esai-1").value = defaultContent.esai1;
  document.getElementById("edit-esai-2").value = defaultContent.esai2;
  document.getElementById("edit-esai-3").value = defaultContent.esai3;
  document.getElementById("edit-esai-4").value = defaultContent.esai4;
  document.getElementById("edit-esai-5").value = defaultContent.esai5;

  showCustomNotification("Materi dikembalikan ke versi default.", "info");
}

// Kirim ke Google Drive
async function kirimTugasOnline() {
  const nama = document.getElementById("nama-siswa").value.trim();
  const kelas = document.getElementById("kelas-siswa").value;
  const absen = document.getElementById("absen-siswa").value.trim();

  if (!nama || !kelas || !absen) {
    showCustomNotification(
      "Harap isi Nama, Kelas, dan Nomor Absen terlebih dahulu!",
      "error",
    );
    return;
  }

  if (!uploadedBase64Data) {
    showCustomNotification(
      "Harap upload file gambar logo karya kamu terlebih dahulu!",
      "error",
    );
    return;
  }

  if (!savedGasUrl) {
    showCustomNotification(
      "URL Google Apps Script belum dimasukkan di Panel Pemateri!",
      "error",
    );
    openGuruPasscodeModal();
    return;
  }

  const cleanBase64 = uploadedBase64Data.includes(",")
    ? uploadedBase64Data.split(",")[1]
    : uploadedBase64Data;
  const formattedFileName = `[${kelas}] - ${nama} - Absen ${absen} - Logo.png`;

  const payload = {
    namaSiswa: nama,
    kelasSiswa: kelas,
    absenSiswa: absen,
    deskripsiKarya: document.getElementById("deskripsi-karya").value,
    esai1: document.getElementById("esai-1").value,
    esai2: document.getElementById("esai-2").value,
    esai3: document.getElementById("esai-3").value,
    esai4: document.getElementById("esai-4").value,
    esai5: document.getElementById("esai-5").value,
    ratingPemahaman: document.getElementById("nilai-pemahaman-siswa").value,
    kritikSaran: document.getElementById("kritik-saran-siswa").value,
    imageBase64: cleanBase64,
    fileName: formattedFileName,
    mimeType: uploadedMimeType || "image/png",
  };

  const btn = document.getElementById("btn-kirim-online");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mengirim ke Google Drive...`;

  try {
    await fetch(savedGasUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    showCustomNotification(
      "Tugas & logo berhasil terkirim ke Google Drive!",
      "success",
    );
    btn.innerHTML = `<i class="fa-solid fa-check text-emerald-300"></i> Tugas Terkirim!`;
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }, 4000);
  } catch (error) {
    console.error(error);
    showCustomNotification(
      "Gagal mengirim tugas. Periksa koneksi atau URL Script guru.",
      "error",
    );
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// Notification Popup
function showCustomNotification(message, type = "info") {
  const notif = document.createElement("div");
  let bg = "bg-slate-800";
  if (type === "success") bg = "bg-emerald-600";
  if (type === "error") bg = "bg-red-600";

  notif.className = `fixed bottom-5 right-5 ${bg} text-white px-4 py-3 rounded-xl shadow-xl z-[120] text-xs font-semibold flex items-center gap-2 transition-all duration-300 transform translate-y-2 opacity-0`;
  notif.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.classList.remove("translate-y-2", "opacity-0");
  }, 10);

  setTimeout(() => {
    notif.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Reset Form
function resetForm() {
  document
    .querySelectorAll('input[type="text"], textarea, input[type="number"]')
    .forEach((input) => {
      if (input.id !== "edit-gas-url") input.value = "";
    });
  document
    .querySelectorAll("select")
    .forEach((select) => (select.selectedIndex = 0));
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach((chk) => (chk.checked = false));

  setPahamRating(0);
  removeUploadedFile();

  showCustomNotification("Semua isian LKPD berhasil dikosongkan.", "info");
}
