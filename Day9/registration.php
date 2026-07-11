<?php

include("db_connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $branch = mysqli_real_escape_string($conn, $_POST['branch']);
    $cgpa = mysqli_real_escape_string($conn, $_POST['cgpa']);

    $sql = "INSERT INTO `12345` (name, email, branch, cgpa)
            VALUES ('$name', '$email', '$branch', '$cgpa')";

    if (mysqli_query($conn, $sql))
    {
        echo "Student registered successfully!";
    }
    else
    {
        echo "Error: " . mysqli_error($conn);
    }
    $password=$_POST['password'];
$confirm=$_POST['confirm_password'];

if(strlen($password)<8){
die("Password must contain at least 8 characters.");
}

if($password!=$confirm){
die("Passwords do not match.");
}
}

?>
