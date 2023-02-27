const cameraOptions = document.querySelector('.custom-select');
const play = document.querySelector('.play')
const stop = document.querySelector('.stop')
const controls = document.querySelector('.controls')

const getCameraSelection = async () => {
  await navigator.mediaDevices.getUserMedia({video: true})
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join('');
}

window.onload = getCameraSelection();


const startStream = async () => {
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      deviceId: {
        exact: cameraOptions.value
      }
    }
  })
  .then((mediaStream) => {
    const video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.onloadedmetadata = () => {
      video.play();
    };
  })
  .then(
    controls.classList.add('transparent')
  )
  .catch((err) => {
    console.error(`${err.name}: ${err.message}`);
  });
}

const stopPlayback = () => {
  const videoElem = document.querySelector('video')
  const stream = videoElem.srcObject;
  const tracks = stream.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });

  videoElem.srcObject = null;
}

cameraOptions.addEventListener("click", (event) => {
  startStream()
})

play.addEventListener("click", (event) => {
  startStream()
})

stop.addEventListener("click", (event) => {
  stopPlayback()
})