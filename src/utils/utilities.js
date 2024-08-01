import Cookies from "js-cookie";
import { toast } from "react-toastify";
export const isoDateToLocale = (isoDate) => {
  var isodate = new Date(isoDate);
  return isodate.toLocaleDateString("hr-HR");
};
export const getJWT = () => {
  var token = Cookies.get("JWT");
  if (token === undefined) {
    console.log("token expired");
    toast.error("Vaša sesija je istekla, molimo prijavite se ponovo", {
      toastId: 0,
      closeButton: false,
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      onClose: () => {
        window.location.reload();
      },
    });
  } else return token;
};
