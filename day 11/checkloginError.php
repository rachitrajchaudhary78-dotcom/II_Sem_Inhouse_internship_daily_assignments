<?php

// Database connection
$conn = mysqli_connect("localhost", "root", "", "industrial_traning");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);

    // Check if fields are empty
    if (empty($email) || empty($password)) {

        echo "All fields are required.";

    } else {
$selectQuery = "SELECT * FROM `class`
WHERE email='$email' AND password='$password'";

        $result = mysqli_query($conn, $selectQuery);
    
        if ($result) {
             session_start();
        $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                        $_SESSION['user_email'] = $user['email'];
            header("Location: dashboard.php");
            exit();
        } else {
            echo "Invlid credentials.";
            
        }
    }
}

?>