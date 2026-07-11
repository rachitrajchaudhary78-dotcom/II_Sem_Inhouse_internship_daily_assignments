<?php
include ("header.php");
include("checkloginError.php");

include("db_connect.php");
?>

<div class="container mt-5" style="max-width:400px;">
    <form action="" method="post">
        <h3 class="mb-3">Login</h3>

        <!-- <input type="text" name="name" class="form-control mb-3" placeholder="Name" > -->

        <input type="email" name="email" class="form-control mb-3" placeholder="Email">

        <input type="password" name="password" class="form-control mb-3" placeholder="Password">

        <button type="submit" class="btn btn-primary w-100">
    Login
</button>
    </form>
</div>
<?php
include("fotter.php");
?>