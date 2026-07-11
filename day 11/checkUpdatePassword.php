<?php
session_start();
include("db_connect.php");

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Get form data
$currentPassword = mysqli_real_escape_string($conn, $_POST['current_password']);
$newPassword = mysqli_real_escape_string($conn, $_POST['new_password']);
$confirmPassword = mysqli_real_escape_string($conn, $_POST['confirm_password']);

$userId = $_SESSION['user_id'];

// Check if any field is empty
if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
    echo "All fields are required.";
    exit();
}

// Check if new password and confirm password match
if ($newPassword != $confirmPassword) {
    echo "New Password and Confirm Password do not match.";
    exit();
}

// Verify current password
$checkQuery = "SELECT * FROM `class`
               WHERE id='$userId' AND password='$currentPassword'";

$result = mysqli_query($conn, $checkQuery);

if (mysqli_num_rows($result) == 1) {

    // Update password
    $updateQuery = "UPDATE `class`
                    SET password='$newPassword'
                    WHERE id='$userId'";

    if (mysqli_query($conn, $updateQuery)) {

        echo "<script>
                alert('Password updated successfully.');
                window.location='dashboard.php';
              </script>";

    } else {

        echo "Error updating password.";

    }

} else {

    echo "Current password is incorrect.";

}
?>