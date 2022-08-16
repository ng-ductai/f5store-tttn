import { Avatar } from "antd";
import { DEFAULT_USER_AVT } from "../constants";

const logoUrl = DEFAULT_USER_AVT;

export const renderPhotoAccout = (photoURL, val, displayName) => {
  if (photoURL) {
    return <Avatar src={photoURL} size={val} alt={displayName} />;
  } else {
    return <Avatar src={logoUrl} size={val} alt={displayName} />;
  }
};
