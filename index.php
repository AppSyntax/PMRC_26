<?php session_start(); ?>
<link rel="stylesheet" href="style.css">
<div class="topbar">
  <button class="btn" onclick="adminLogin()">Admin</button>
</div>
<script>
function adminLogin(){
  let p = prompt("Enter Admin Password:");
  if(p=="2026admin"){ window.location="dashboard.php"; }
  else alert("Wrong Password");
}
</script>
<center style="margin-top:60px">
  <h1>Provost Marshal Run Challenge 2026</h1>
  <p><b>Start:</b> 6 January 2026 — <b>End:</b> 30 January 2026</p>
  <button class="btn" onclick="window.location='runner.php'">Runner Login</button>
</center>