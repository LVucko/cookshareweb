export const validateUsername = (e) => {
  if (e === null || e.length === 0) {
    return "Molimo unesite korisničko ime";
  } else if (e.length < 6) {
    return "Korisničko ime mora biti barem 6 znakova";
  } else if (e.match(/^[A-Za-z]\w{5,29}$/)) {
    return null;
  } else {
    return "Korisničko ime mora počinjati slovom, a može sadržavati brojeve i znak";
  }
};

export const validatePassword = (e) => {
  if (
    e.match(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/
    )
  ) {
    return null;
  } else {
    return "Lozinka mora sadržavati 8-20 znakova, broj, veliko i malo slovo, i poseban znak";
  }
};

export const validateEmail = (e) => {
  if (e.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)) {
    return null;
  } else {
    return "Molimo unesite ispravan e-mail";
  }
};
