import { Component } from '@angular/core';
import { VideosService } from 'src/app/services/videos/videos.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  public user_information: any | null = null;
  public dataVideo: any = [];
  public dataSchedule: any = [];
  public loading: boolean = true;
  public countVBL: number = 0;
  public countBT: number = 0;
  public countVT: number = 0;

  constructor(    
    private videosService: VideosService,
  ){
    const storedUserInfo = localStorage.getItem('user');
    this.user_information = storedUserInfo ? JSON.parse(storedUserInfo) : null;
  }

  ngOnInit() {
    this.getVideos();
  }

  /** 
   * Trae los videos cargados
   */
  getVideos() {
    this.videosService.listVideos().subscribe({
      next: (response) => {
        this.dataVideo = response;
        this.getSchedule();
      }, error: (error) => {
        this.loading = false;
        Swal.fire({
          title: '¡Ups! Algo salió mal',
          text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  /** 
   * Trae los videos programados cargados
   */
  getSchedule(){
    this.videosService.listSchedule().subscribe({
      next: (response) => {
        this.dataSchedule = response;
        this.countTypes();
      }, error: (error) => {
        this.loading = false;
        Swal.fire({
          title: '¡Ups! Algo salió mal',
          text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  /** 
   * Trae contados, cuantos tipos de contenido hay cargados
   */
  countTypes() {
    this.countVBL = this.dataVideo.filter((video:any) => video.type === 'VBL').length;
    this.countBT = this.dataVideo.filter((video:any) => video.type === 'BT').length;
    this.countVT = this.dataVideo.filter((video:any) => video.type === 'VT').length;
    this.loading = false;
  }
}
