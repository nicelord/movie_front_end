import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {Jsonp, Response, URLSearchParams} from "@angular/http";
import {Observable, BehaviorSubject, Subject} from "rxjs";
import {AppSettings} from "../app-settings";


declare var jwplayer: any;

@Injectable()
export class JwplayerService {

  sub: any;
  error : boolean = false;

  cfg = {
    title: '',
    "preload": "none",
    "autostart": false,
    "controls": true,
    "mute": false,
    "useAudioTag": true,
    sources: [],
    skin: {
      name: "vapor",
      url: "../../../assets/js/jwplayer/skins/vapor.css"
    },

    "width": "100%",
    "volume": 50,
    "aspectratio": "16:9",
    image: '',
    "primary": "html5",
    hlshtml: true,
    enableFullscreen: 'false',
    "logo": {file: "http://www.movietrex.com/wp-content/uploads/logo.png", link: "http://www.movietrex.com"},
    tracks: [{
      file: "",
      label: "",
      kind: "captions"
    }]
  };

  constructor() {

  }

  changeSource(x:number){
    return Promise.resolve(
      jwplayer("jwplayer")
    ).then(
      playerInstance =>{
        playerInstance.setCurrentQuality(x);
        if(playerInstance.getState()=='playing'){
          playerInstance.play();
        }else{
          playerInstance.pause(true);
        }
      }
    );
  }

  loadMedia(media) {


    this.cfg.title = media.title;
    this.cfg.sources = [];
    let linkId = 0;
    let qId = 0;
    for(let streamlink of media.location){
      if(streamlink.streamLinkId > linkId){
        linkId = streamlink.streamLinkId;
      }
      if(streamlink.quality.qualityId > qId){
        qId = streamlink.quality.qualityId;
      }
      if(streamlink.link != null && !streamlink.isIframe){
        this.cfg.sources.push({
          file:streamlink.link,
          label:streamlink.serverSource.serverName +" "+ streamlink.quality.quality + " [" + streamlink.resolution.resolution+"p]",
          type : 'video/mp4',
          'default' : (streamlink.serverSource.serverName == 'Google' && streamlink.streamLinkId == linkId  && streamlink.quality.qualityId == qId)
        });
      }

    }
    this.cfg.image = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=700&url='+media.image;
    this.cfg.tracks = [];

    return Promise.resolve(
      jwplayer("jwplayer").setup(this.cfg)
    ).then(
      playerInstance =>{
        playerInstance.on("seeked", function () {
          playerInstance.pause(true);
        });
        playerInstance.on("error", function () {


        });
      }
    );
  }

  getPlayer(){
    return Promise.resolve(
      jwplayer("jwplayer"));

  }

  test(media) {
    this.cfg.title = "TEST";
    this.cfg.sources = [];

    this.cfg.sources.push({
      file:media,
      label:"TEST",
      type : 'm3u8',
     });
    this.cfg.image = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=700&url='+media.image;
    this.cfg.tracks = [];

    return Promise.resolve(
      jwplayer("jwplayer").setup(this.cfg)
    ).then(

      playerInstance =>{
        playerInstance.on("seeked", function () {
          playerInstance.pause(true);
        });
        playerInstance.on("error", function () {
          this.parent.playerError = true;
        });
      }
    );
  }

  switchSubOff(){

    return Promise.resolve(
      jwplayer("jwplayer"))
      .then(
        playerInstance => {
          playerInstance.setCurrentCaptions(0)
        }
      )

  }


  changeSub() {
    this.cfg.tracks[0].file = AppSettings.API_ENDPOINT+"/subs/sub_sign/8f1b7b5c-92cc-4d16-832c-1361d7987220";
    let curPos = jwplayer("jwplayer").getPosition();
    jwplayer("jwplayer").setup(this.cfg);
    jwplayer("jwplayer").on("seeked", function () {
      jwplayer("jwplayer").pause(true);
    });
    jwplayer("jwplayer").seek(curPos);
  }


  loadCurrentCaptionList(){
    let subList : any[] = [];

    return Promise.resolve(
      jwplayer("jwplayer"))
      .then(
        playerInstance => {
          for (let entry of playerInstance.getCaptionsList()) {
            if(entry.label!=="Unknown CC" && entry.label!=="Off"){
              subList.push({
                fileName:entry.label,
                signature:entry.id.substring(entry.id.lastIndexOf("/"),entry.id.length).replace("/","")
            });

            }
          }
          return subList;
        },
      );
  }

  checkSignature(tracks:any[],signature:String):boolean{
    for(let caption of tracks){
      let sig = caption.id.substring(caption.id.lastIndexOf("/"),caption.id.length).replace("/","");
      if(sig == signature){
        return true;
      }
    }
    return false;
  }


  setUpNewSubList(subtitles:any[],subtitle:any){

    return Promise.resolve(
      jwplayer("jwplayer"))
      .then(
        playerInstance => {
          if(this.checkSignature(playerInstance.getCaptionsList(),subtitle.signature)){
            return jwplayer("jwplayer").setCurrentCaptions(subtitles.indexOf(subtitle)+1);
          }

          this.cfg.tracks = [];
          for(let sub of subtitles){
            this.cfg.tracks.push({
              file:AppSettings.API_ENDPOINT+"/subs/sub_sign/"+sub.signature.toString(),
              label:sub.fileName,
              kind:"captions"
            })
          }
          let curPos = jwplayer("jwplayer").getPosition();
          jwplayer("jwplayer").setup(this.cfg);
          jwplayer("jwplayer").setCurrentCaptions(subtitles.indexOf(subtitle)+1);
          jwplayer("jwplayer").on("seeked", function () {
            jwplayer("jwplayer").pause(true);
          });
          jwplayer("jwplayer").seek(curPos);

        }
      );
  }


  togglePlayPause() {
    return Promise.resolve(
      jwplayer("jwplayer"))
      .then(
        playerInstance => {
          return playerInstance.pause(true)
        }
      );
  }

  stopJwPlayer() {
    return Promise.resolve(
      jwplayer("jwplayer"))
      .then(
        playerInstance => {
          return playerInstance.stop(true)
        }
      );
  }


}
