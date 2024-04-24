import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        const name = req.body?.name;
        req.body.imgUrl = name + "_" + Date.now() + "." + ext;
        cb(null, req.body.imgUrl)
    }
})
export const upload = multer({ storage: storage});