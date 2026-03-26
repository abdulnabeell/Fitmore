// user-auth.js
(async function () {

  try {

    const res = await fetch("/api/user/profile", {
      credentials: "include"
    });

    if (!res.ok) {
      console.warn("User not authenticated");
      window.location.replace("/user/login.html");
      return;
    }

    console.log("User authenticated");

  } catch (err) {
    console.error(err);
    window.location.replace("/user/login.html");
  }

})();