import { project } from './basicWords';

export default {
  contentUploadDialog: {
    upload: `Upload material for ${project()}`,
    titleField: {
      label: 'Title',
      err: 'Material with the same name already exists'
    },
    typeField: 'Material Type',
    authorsAttribute: 'Authors',
    addRef: 'Add references to material posted on platform',
    createProp: 'Upload',
    uploadMat: 'Upload Material',
    cancel: 'Cancel',
    fileUploaded: 'This file was already uploaded. Please vote for existing proposal or propose file again if its existing proposal has expired.',
    success: 'New material has been uploaded successfully',
    errFile: 'Sorry, the file storage server is temporarily unavailable, please try again later',
    errFileUpload: 'Material upload has failed',
    errUploadingContent: 'An error occurred while uploading material, please try again later'
  }
};
