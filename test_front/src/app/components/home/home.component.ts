import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { VideosService } from 'src/app/services/videos/videos.services';
import { environment } from 'src/environments/environments';

interface Video {
  id: number;
  title: string;
  type: string;
  video_path: string | null;
  banner_image: string | null;
  banner_text: string | null;
  duration: number | null;
  execution_time: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  public loading = true;
  public dataVideo: Video[] = [];
  public currentVideoIndex = 0;
  public isScheduledPlaying = false;
  public scheduledVideos: Video[] = [];
  public playedScheduledVideos: Set<number> = new Set();
  public scheduledVideoQueue: Video[] = [];
  public environment = environment;
  private videoTimeout: any = null;

  constructor(
    private videoService: VideosService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.loadVideos();
  }

  /** 
   * Trae los videos cargados
   */
  loadVideos() {
    this.videoService.getVideoShcedules().subscribe(
      (videos: Video[]) => {
        this.dataVideo = videos;
        this.loading = false;
        this.checkScheduledVideos();
        this.scheduleNextVideo();
      },
      () => {
        this.loading = false;
      }
    );
  }

  /** 
   * Filtra los videos programados que se deben mostrar
   */
  checkScheduledVideos() {
    const currentTime = new Date();
    this.scheduledVideos = this.dataVideo.filter(video => {
      if (this.playedScheduledVideos.has(video.id)) {
        return false;
      }

      if(video.execution_time === null){
        return false;
      }
      
      const [hour, minute] = video.execution_time.split(':').map(Number);
      const executionDate = new Date();
      executionDate.setHours(hour, minute, 0, 0);
      const oneMinuteLater = new Date(executionDate.getTime() + 1 * 60000);
      return (
        executionDate.getTime() <= currentTime.getTime() &&
        currentTime.getTime() <= oneMinuteLater.getTime()
      );
    });
    this.scheduledVideos.forEach(video => {
      if (!this.scheduledVideoQueue.some(v => v.id === video.id)) {
        this.scheduledVideoQueue.push(video);
      }
    });
  }
  
  /** 
   * Verifica que los videos programados se reproduzcan en orden
   */
  scheduleNextVideo() {
    if (this.isScheduledPlaying || this.scheduledVideos.length === 0) {
      return;
    }
    const nextScheduledVideo = this.scheduledVideos[0];
    const videoIndex = this.dataVideo.findIndex(v => v.id === nextScheduledVideo.id);
    if (videoIndex !== -1) {
      this.currentVideoIndex = videoIndex;
      this.isScheduledPlaying = true;
      this.playedScheduledVideos.add(nextScheduledVideo.id);
      this.clearVideoTimeout();
      const videoDuration = nextScheduledVideo.duration ? nextScheduledVideo.duration * 1000 : 5000;
      this.videoTimeout = setTimeout(() => {
        this.isScheduledPlaying = false;
        this.checkScheduledVideos();
        this.nextVideo();
      }, videoDuration);
    }
  }

  /** 
   * Asegura que los videos programados tengan prioridad para mostrarse
   */
  nextVideo() {
    if (this.scheduledVideoQueue.length > 0) {
      const nextScheduledVideo = this.scheduledVideoQueue.shift();
      const videoIndex = this.dataVideo.findIndex(v => v.id === nextScheduledVideo!.id);
      if (videoIndex !== -1) {
        this.currentVideoIndex = videoIndex;
        this.isScheduledPlaying = true;
        this.clearVideoTimeout();
        const videoDuration = nextScheduledVideo!.type === 'BT' ? 5000 : (nextScheduledVideo!.duration ? nextScheduledVideo!.duration * 1000 : 5000);
        this.videoTimeout = setTimeout(() => {
          this.isScheduledPlaying = false;
          this.checkScheduledVideos();
          if (this.scheduledVideoQueue.length > 0) {
            this.nextVideo();
          } else {
            this.resumeNormalCycle();
          }
        }, videoDuration);
      }
    } else {
      this.resumeNormalCycle();
    }
  }

  /** 
   * Maneja la reproducción de videos del ciclo normal
   */
  resumeNormalCycle() {
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.dataVideo.length;
    const currentVideo = this.dataVideo[this.currentVideoIndex];
    if (currentVideo) {
      this.clearVideoTimeout(); 
      const videoDuration = currentVideo.duration ? currentVideo.duration * 1000 : 5000;
      this.videoTimeout = setTimeout(() => {
        this.checkScheduledVideos();
        this.scheduleNextVideo();
        this.nextVideo();
      }, videoDuration);
    } else {
      console.error("Error: No se encontró el video en el índice actual");
      this.nextVideo();
    }
  }

  /** 
   * Limpia cualquier temporizador previo
   */
  clearVideoTimeout() {
    if (this.videoTimeout) {
      clearTimeout(this.videoTimeout);
      this.videoTimeout = null;
    }
  }
  
  /** 
   * Redirreción al componente de login
   */
  login() {
    this.route.navigate(['/login']);
  }
}
