<?php

// Database connection
$conn = mysqli_connect("localhost", "root", "", "industrial_traning");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = mysqli_real_escape_string($conn, $_POST["name"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);
    $confirmPassword = mysqli_real_escape_string($conn, $_POST["confirmPassword"]);

    if ($name == "" || $email == "" || $password == "" || $confirmPassword == "") {

        echo "All fields are required.";

    } elseif ($password != $confirmPassword) {

        echo "Passwords do not match.";

    } else {

        $insertQuery = "INSERT INTO class (name, email, password)
                        VALUES ('$name', '$email', '$password')";

        $result = mysqli_query($conn, $insertQuery);

        if ($result) {
            header("Location: success.php");
            exit();
        } else {
            echo "Error occurred while storing data.";
        }
    }
}

?>