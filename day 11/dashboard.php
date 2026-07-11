 <?php
include("header.php");

session_start();
echo "Welcome " . $_SESSION['user_name'];
?> 


<div class="container mt-5">
    <div class="mt-3">
    <a href="update_password.php" class="btn btn-warning me-2">
        Update Password
    </a>
    <div class="card shadow p-4">
        <h2 class="text-success">Welcome to the Dashboard </h2>
        <p>You have logged in successfully.</p>

        <hr>

        <a href="logout.php" class="btn btn-danger">Logout</a>
        
 </div>
</div>

<?php
// include("footer.php");
?>