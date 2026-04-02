(async function () {
  try {
    const res = await fetch("/api/user/profile", {
      credentials: "include"
    });

    if (!res.ok) {
      console.warn("User not authenticated");

      // show login/signup
      document.getElementById("signupLink")?.classList.remove("hidden");
      return;
    }

    const data = await res.json();

    console.log("User authenticated", data);

    // hide signup, show user icon
    document.getElementById("signupLink")?.classList.add("hidden");
    document.getElementById("userIconBtn")?.classList.remove("hidden");

  } catch (err) {
    console.error(err);
  }
})();