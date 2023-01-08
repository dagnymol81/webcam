// Put variables in global scope to make them available to the browser console.
const video = document.querySelector('video');
const constraints = {
  audio: true,
  video: true
};

navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    const videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    stream.onremovetrack = () => {
      console.log('Stream ended');
    };
    video.srcObject = stream;
  })
  .catch((error) => {
    if (error.name === 'ConstraintNotSatisfiedError') {
      console.error(
        `The resolution ${constraints.video.width.exact}x${constraints.video.height.exact} px is not supported by your device.`
      );
    } else if (error.name === 'PermissionDeniedError') {
      console.error(
        'Permissions have not been granted to use your camera and ' +
          'microphone, you need to allow the page access to your devices in ' +
          'order for the demo to work.'
      );
    } else {
      console.error(`getUserMedia error: ${error.name}`, error);
    }
  });