// Signup
$("#signupForm").on("submit", function (e) {
  e.preventDefault();
  const data = $(this).serialize();

  $.post("/api/signup", data, function (res) {
    alert("Akun berhasil dibuat!");
    window.location.href = "login.html";
  }).fail(() => {
    alert("Gagal daftar, coba lagi.");
  });
});

// Login
$("#loginForm").on("submit", function (e) {
  e.preventDefault();
  const data = $(this).serialize();

  $.post("/api/login", data, function (res) {
    alert("Login sukses!");
    window.location.href = "index.html"; // arahkan ke halaman utama
  }).fail(() => {
    alert("Email/password salah");
  });
});
