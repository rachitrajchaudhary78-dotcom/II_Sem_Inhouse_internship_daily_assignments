<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

include("header.php");
?>
<form action="checkUpdatePassword.php" method="POST">
<div class="container mt-5" style="max-width:500px;">

    <div class="card shadow">
        <div class="card-header bg-warning text-dark">
            <h3 class="mb-0">Update Password</h3>
        </div>

        <div class="card-body">

            <form action="checkUpdatePassword.php" method="POST">

                <div class="mb-3">
                    <label class="form-label">Current Password</label>
                    <input type="password"
                           name="current_password"
                           class="form-control"
                           placeholder="Enter current password"
                           required>
                </div>

                <div class="mb-3">
                    <label class="form-label">New Password</label>
                    <input type="password"
                           name="new_password"
                           class="form-control"
                           placeholder="Enter new password"
                           required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Confirm New Password</label>
                    <input type="password"
                           name="confirm_password"
                           class="form-control"
                           placeholder="Confirm new password"
                           required>
                </div>

                <button type="submit" class="btn btn-warning w-100">
                    Update Password
                </button>

            </form>

            <div class="mt-3 text-center">
                <a href="dashboard.php" class="btn btn-secondary">
                    Back to Dashboard
                </a>
            </div>

        </div>
    </div>

</div>

<?php
// include("footer.php");
?>