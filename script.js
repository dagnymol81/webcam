const cameraOptions = document.querySelector('#cameras');
const play = document.querySelector('.play')
const stopBtn = document.querySelector('.stop')
const controls = document.querySelector('.controls')
const cameras = new Map()

const getCameraSelection = async () => {
  await navigator.mediaDevices.getUserMedia({video: true})
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    const selected = videoDevice.getCapabilities()
    cameras.set(selected.deviceId, selected)
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join('');
}

window.onload = getCameraSelection();

const startStream = () => {

  const camera = cameras.get(cameraOptions.value)
  let width = camera.width.max
  let height = camera.height.max

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      deviceId: {
        exact: camera.deviceId
      },
      width: { ideal: width },
      height: { ideal: height }
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
  controls.classList.remove('transparent')
}

cameraOptions.addEventListener("click", (event) => {
  startStream()
})

play.addEventListener("click", (event) => {
  startStream()
})

stopBtn.addEventListener("click", (event) => {
  stopPlayback()
})