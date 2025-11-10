// src/viewmodels/SignupViewModel.js
export class SignupViewModel {
  async signup(form) {
    if(form.nom && form.prenom && form.dob && form.nas && form.email && form.password){
      console.log("Compte créé :", form);
      localStorage.setItem("user", JSON.stringify(form));
      return true;
    }
    return false;
  }
}
