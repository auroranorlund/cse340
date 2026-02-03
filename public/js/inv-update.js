const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const editBtn = document.querySelector("#login-button")
      editBtn.removeAttribute("disabled")
    })