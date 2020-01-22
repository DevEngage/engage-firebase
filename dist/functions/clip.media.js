/*
@ffmpeg-installer/ffmpeg
@google-cloud/storage
child-process-promise
mkdirp
mkdirp-promise
*/
// export default class ClipMediaFunction {
//     generateFromImage(file, tempLocalThumbFile, fileName) {
//         const tempLocalFile = path.join(os.tmpdir(), fileName);
//         // Download file from bucket.
//         return file.download({destination: tempLocalFile}).then(() => {
//             console.info('The file has been downloaded to', tempLocalFile);
//             // Generate a thumbnail using ImageMagick with constant width and variable height (maintains ratio)
//             return spawn('convert', [tempLocalFile, '-thumbnail', THUMB_MAX_WIDTH, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
//         }).then(() => {
//             fs.unlinkSync(tempLocalFile);
//             return Promise.resolve();
//         })
//     }
//     generateFromVideo(file, tempLocalThumbFile) {
//         return file.getSignedUrl({action: 'read', expires: '05-24-2999'}).then((signedUrl) => {
//             const fileUrl = signedUrl[0];
//             const promise = spawn(ffmpegPath, ['-ss', '0', '-i', fileUrl, '-f', 'image2', '-vframes', '1', '-vf', `scale=${THUMB_MAX_WIDTH}:-1`, tempLocalThumbFile]);
//             // promise.childProcess.stdout.on('data', (data) => console.info('[spawn] stdout: ', data.toString()));
//             // promise.childProcess.stderr.on('data', (data) => console.info('[spawn] stderr: ', data.toString()));
//             return promise;
//         })
//     }
// }
/*

const functions = require('firebase-functions');

const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage');
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const os = require('os');
const fs = require('fs');

const db = admin.firestore();

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_WIDTH = 384;

const SERVICE_ACCOUNT = '<your firebase credentials file>.json';

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);

module.exports = functions.storage.bucket(adminConfig.storageBucket).object().onFinalize(object => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePathInBucket = object.name;
    const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
    const contentType = object.contentType; // This is the image MIME type
    const isImage = contentType.startsWith('image/');
    const isVideo = contentType.startsWith('video/');

    // Exit if this is a move or deletion event.
    if (resourceState === 'not_exists') {
        return Promise.resolve();
    }
    // Exit if file exists but is not new and is only being triggered
    // because of a metadata change.
    else if (resourceState === 'exists' && metageneration > 1) {
        return Promise.resolve();
    }
    // Exit if the image is already a thumbnail.
    else if (filePathInBucket.indexOf('.thumbnail.') !== -1) {
        return Promise.resolve();
    }
    // Exit if this is triggered on a file that is not an image or video.
    else if (!(isImage || isVideo)) {
        return Promise.resolve();
    }


    const fileDir            = path.dirname(filePathInBucket);
    const fileName           = path.basename(filePathInBucket);
    const fileInfo           = parseName(fileName);
    const thumbFileExt       = isVideo ? 'jpg' : fileInfo.ext;
    let   thumbFilePath      = path.normalize(path.join(fileDir, `${fileInfo.name}_${fileInfo.timestamp}.thumbnail.${thumbFileExt}`));
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
    const tempLocalDir       = path.join(os.tmpdir(), fileDir);
    const generateOperation  = isVideo ? generateFromVideo : generateFromImage;


    // Cloud Storage files.
    const bucket = gcs({keyFilename: SERVICE_ACCOUNT}).bucket(fileBucket);
    const file = bucket.file(filePathInBucket);

    const metadata = {
        contentType: isVideo ? 'image/jpeg' : contentType,
        // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
        // 'Cache-Control': 'public,max-age=3600',
    };


    // Create the temp directory where the storage file will be downloaded.
    return mkdirp(tempLocalDir).then(() => {
        return generateOperation(file, tempLocalThumbFile, fileName);
    }).then(() => {
        console.info('Thumbnail created at', tempLocalThumbFile);
        // Get the thumbnail dimensions
        return spawn('identify', ['-ping', '-format', '%wx%h', tempLocalThumbFile], {capture: ['stdout', 'stderr']});
    }).then((result) => {
        const dim = result.stdout.toString();
        const idx = thumbFilePath.indexOf('.');

        thumbFilePath = `${thumbFilePath.substring(0,idx)}_${dim}${thumbFilePath.substring(idx)}`;
        console.info('Thumbnail dimensions:', dim);
        // Uploading the Thumbnail.
        return bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
    }).then(() => {
        console.info('Thumbnail uploaded to Storage at', thumbFilePath);

        const thumbFilename = path.basename(thumbFilePath);

        return updateDatabase(fileDir, fileName, thumbFilename);
    }).then(() => {
        console.info('Thumbnail generated.');

        fs.unlinkSync(tempLocalThumbFile);

        return Promise.resolve();
    })
});

*/ 
//# sourceMappingURL=clip.media.js.map