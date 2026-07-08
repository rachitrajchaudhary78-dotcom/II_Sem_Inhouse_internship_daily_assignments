<?php
include ("header.php");
include("checkregistrationError.php");
include("db_connect.php");
?>

<div class="container mt-5" style="max-width:400px;">
    <form action="" method="post">
        <h3 class="mb-3">Register</h3>

        <input type="text" name="name" class="form-control mb-3" placeholder="Name">

        <input type="email" name="email" class="form-control mb-3" placeholder="Email">

        <input type="password" name="password" class="form-control mb-3" placeholder="Password">

<input type="password" name="confirmPassword" class="form-control mb-3" placeholder="Confirm Password">
        <button class="btn btn-primary w-100" t`ype="submit">
            Register
        </button>
    </form>
</div>
<?php
include("fotter.php");
?>