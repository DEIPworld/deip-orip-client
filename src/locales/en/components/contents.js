import { project } from './basicWords';

export default {
  contentUploadDialog: {
    upload: `Upload material for ${project()}`,
    titleField: {
      label: 'Title',
      err: 'Content with the same name already exists'
    },
    typeField: 'Content Type',
    authorsAttribute: 'Authors',
    createProp: 'Upload',
    uploadMat: 'Upload Material',
    cancel: 'Cancel',
    fileUploaded: 'This file was already uploaded. Please vote for existing proposal or propose file again if its existing proposal has expired.',
    success: 'New material has been uploaded successfully',
    errFile: 'Sorry, the file storage server is temporarily unavailable, please try again later',
    errFileUpload: 'File upload has failed',
    errUploadingContent: 'An error occurred while uploading content, please try again later'
  }
};
