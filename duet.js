var app = new Vue({
  el: '#duet',
  data: {
    audioOutputs: [],
    audioTracks: [],
    playing: false,
  },
  methods: {
    addAudioTrack: function () {
      var audioTrackFileEle = document.getElementById('audioTrackFile');
      if (audioTrackFileEle.files.length === 1 && !this.playing) {
        var file = audioTrackFileEle.files[0];
        this.audioTracks.push({
          idx: this.audioTracks.length,
          audioOutputDeviceId: 'default',
          file: file,
          src: URL.createObjectURL(file),
        });
        audioTrackFileEle.value = '';
      }
      //Todo: add event listener to set this.playing = false when ALL audio tracks are done
    },
    useAudioOutput: function (e) {
      this.audioTracks[e.target.getAttribute('track')].audioOutputDeviceId = e.target.id;
      document.querySelector(`audio#track${e.target.getAttribute('track')}`).setSinkId(e.target.id).catch((error) => {
        alert(error);
      });
    },
    play: function() {
      if (this.audioTracks.length > 0) {
        this.playing = !this.playing;
        document.querySelectorAll('audio').forEach((audio) => {
          if (this.playing) {
            audio.play();
          }
          else {
            audio.pause();
            audio.currentTime = 0;
          }
        });
        // Todo: check if ALL audio elements are ready then set currentTime to be equal
      }
    },
  },
});

navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
  mediaDevices.forEach((device) => {
    if (device.kind === 'audiooutput') {
      console.log(device);
      app.audioOutputs.push(device);
    }
  });
});

document.getElementById('audioTrackFile').onchange = () => {
  app.$forceUpdate();
};
