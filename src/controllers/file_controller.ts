import multer from "multer";

const createUpload = (destinationDir: string) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinationDir);
        },
        filename: function (req, file, cb) {
            const ext = file.originalname.split('.')
                .filter(Boolean)
                .slice(1)
                .join('.');
            const name = req.body?.name || 'profile';
            req.body.imgUrl = name + "_" + Date.now() + "." + ext;
            cb(null, req.body.imgUrl);
        }
    });

    return multer({ storage: storage });
};

export { createUpload };
