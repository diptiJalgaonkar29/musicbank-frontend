//import WaveSurfer from 'wavesurfer.js';
//import { WaveSurfer, WaveForm, Region } from "wavesurfer-react";
//import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js"
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";

//https://codesandbox.io/s/wavesurfer-react-20-forked-qj8bj
//https://reactjsexample.com/react-bindings-for-wavesurfer-js/
//https://codepen.io/pravid/pen/vYxoKXr
//https://codepen.io/BusyBee/pen/mOEybQ
//https://codepen.io/ulx/pen/ZBLOxm
//https://github.com/mspae/react-wavesurfer
//https://codesandbox.io/s/wavesurfer-react-20-forked-0sy6l?file=/src/index.js
//https://github.com/katspaugh/wavesurfer.js
//https://github.com/katspaugh/wavesurfer.js/blob/master/example/regions/index.html
//https://www.gitmemory.com/issue/dschoon/react-waves/7/491683950
//https://github.com/ShiiRochi/wavesurfer-react

//'use strict';

// Create an instance
var wavesurfer;

// Init & load audio file
export function activateAudioEditor(_audioTrack) {
    // Init
    wavesurfer = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        waveColor: '#A8DBA8',
        progressColor: '#3B8686',
        backend: 'MediaElement',
        plugins: [
            RegionPlugin.create(),
            /* RegionsPlugin.regions.create({
                regionsMinLength: 2,
                regions: [
                    {
                        start: 1,
                        end: 3,
                        loop: false,
                        color: 'hsla(400, 100%, 30%, 0.5)'
                    },
                    {
                        start: 5,
                        end: 7,
                        loop: false,
                        color: 'hsla(200, 50%, 70%, 0.4)',
                        minLength: 1
                    }
                ],
                dragSelection: {
                    slop: 5
                }
            }) */
        ]
    });

    wavesurfer.on('error', function(e) {
        console.warn(e);
    });

    // Load audio from URL
    wavesurfer.load(_audioTrack);


    /* document.querySelector(
        '[data-action="play-region-1"]'
    ).addEventListener('click', function() {
        let region = Object.values(wavesurfer.regions.list)[0];
        region.play();
    });

    document.querySelector(
        '[data-action="play-region-2"]'
    ).addEventListener('click', function() {
        let region = Object.values(wavesurfer.regions.list)[1];
        region.playLoop();
    }); */

    document.querySelector(
        '[data-action="pause"]'
    ).addEventListener('click', function() {
        wavesurfer.pause();
    });
}
