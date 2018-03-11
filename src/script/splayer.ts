

import Control from './control'

import './../css/splayer.scss'

// 实例接收的参数定义
interface PlayerOptions {
    el    : string
    src   : string
    poster: string
}

class SPlayer {

    public video: HTMLVideoElement
    private control: any
    // Init
    constructor(options: PlayerOptions) {
        this.control = new Control(options)
        this.video = this.control.refs.video
    }

    // 播放
    play(): void {
        this.video.play()
    }

    // 暂停
    pause(): void {
        this.video.pause()
    }

    // 重新加载一个视频
    load(videoSrc: string): void{
        this.video.src = videoSrc
        this.video.load()
    }

    // 获取视频图帧
    getFarme(time: number): Promise <string> {
        return this.control.farme.getFarme(time)
    }
    
}

//  export default Player
(<any> window).SPlayer = SPlayer

