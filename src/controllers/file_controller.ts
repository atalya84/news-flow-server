import multer from 'multer';

const createUpload = (destinationDir: string) => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, destinationDir);
		},
		filename: function (req, file, cb) {
			console.log("heelo puppy")
			const arr = file.originalname.split('.');
			const name = arr[0];
			const ext = arr.filter(Boolean).slice(1).join('.');
			req.body.imgUrl = name + '_' + Date.now() + '.' + ext;
			console.log('createUpload', req.body.imgUrl)
			cb(null, req.body.imgUrl);
		},
	});

	return multer({ storage: storage });
};

export { createUpload };
