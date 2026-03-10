import multer from "multer";

const storage = multer.diskStorage({});
const upload = multer({ storage });

export default upload;
//we will consume it as a middleware in the routes
