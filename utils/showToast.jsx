import { toast } from "react-toastify";

const showToast = (type, content) => {
  const options = {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  switch (type) {
    case "success":
      return toast.success(content, options);
    case "error":
      return toast.error(content, options);
    case "info":
      return toast.info(content, options);
    case "warning":
      return toast.warn(content, options);
    case "default":
      return toast(content, options);
    default:
      return toast(content, options);
  }
};

export default showToast;
