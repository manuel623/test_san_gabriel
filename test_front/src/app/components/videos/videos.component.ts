import { ChangeDetectorRef, Component } from '@angular/core';
import { VideosService } from 'src/app/services/videos/videos.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent {

  public selectedType: string = '';
  public fileError: string = '';
  public formData: any = {};
  public dataVideo: any = [];
  public formUpdateVideos: boolean = false;
  public loadingTable: boolean = true;
  public dataVideoTemp: any = {};
  public createVideoButton: boolean = false;
  public videoDuration: any | null = null;

  constructor(
    private videosService: VideosService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getVideos();
  }

  /**
   * Trae todos los videos cargados
   */
  getVideos() {
    this.videosService.listVideos().subscribe({
      next: (response) => {
        this.dataVideo = response;
        this.loadingTable = false;
      }, error: (error) => {
        this.loadingTable = false;
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
   * Valida la vista del formulario
   */
  toggleFormUpdateVideos() {
    this.formUpdateVideos = !this.formUpdateVideos;
    this.formData = {};
    this.selectedType = '';
    this.dataVideoTemp = {};
    this.videoDuration = null;
  }

  /**
   * Carga de archivos (Videos y banners)
   * @param event :any
   * @param type :string
   * @returns string
   */
  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    this.fileError = '';

    if (file) {
      const maxSizeInMB = 20; // tamaño máximo del archivo (20MB)
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // se convierte a bytes 

      if (file.size > maxSizeInBytes) {
        this.fileError = 'El archivo no puede superar los 20MB.';
        event.target.value = '';
        return;
      }
      // Se obtiene la duración del video
      if (type === 'video') {
        const videoElement = document.createElement('video');
        const fileURL = URL.createObjectURL(file);
        videoElement.src = fileURL;
        videoElement.onloadedmetadata = () => {
          this.videoDuration = Math.floor(videoElement.duration);
          URL.revokeObjectURL(fileURL);
        };
        videoElement.load();
        this.formData.video = file;
      } else if (type === 'banner') {
        this.formData.banner = file;
      }
    }
  }

  /**
   * Valida la vista del formulario segun el tipo de contenido que se va a cargar
   * @returns boolean
   */
  isValidForm() {
    if (this.selectedType === 'VT') {
      return this.formData.video && this.formData.title;
    } else if (this.selectedType === 'VBL') {
      return this.formData.video && this.formData.banner && this.formData.title;
    } else if (this.selectedType === 'BT') {
      return this.formData.banner && this.formData.title;
    }
    return false;
  }

  /**
   * Valida si se creara o editara algún contenido
   */
  public submitForm() {
    if (this.dataVideoTemp && Object.keys(this.dataVideoTemp).length > 0) {
      this.editVideo();
    } else {
      this.createVideo();
    }
  }

  /**
   * Crear video
   */
  public createVideo() {
    if (this.isValidForm()) {
      this.loadingTable = true;
      this.createVideoButton = true;
      const formData = new FormData();
      formData.append('title', this.formData.title);
      formData.append('type', this.selectedType);

      if (this.selectedType === 'VT' || this.selectedType === 'VBL') {
        formData.append('video', this.formData.video);
        formData.append('duration', this.videoDuration);
      }

      if (this.selectedType === 'VBL' || this.selectedType === 'BT') {
        formData.append('banner', this.formData.banner);
      }

      this.videosService.createVideo(formData).subscribe({
        next: (response) => {
          this.createVideoButton = false;
          if (response.original.success) {
            this.getVideos();
            this.toggleFormUpdateVideos();
            Swal.fire({
              title: '¡Video creado!',
              text: response.original.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });
          } else {
            this.loadingTable = false;
            Swal.fire({
              title: '¡Ups! Algo salió mal',
              text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        }, error: (error) => {
          this.createVideoButton = false;
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudo crear el video.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
    }
  }


  /**
   * Editar video
   */
  public editVideo() {
    if (this.isValidForm()) {
      this.createVideoButton = true;
      const formData = new FormData();
      formData.append('title', this.formData.title);
      formData.append('type', this.selectedType);

      if (this.selectedType === 'VT' || this.selectedType === 'VBL') {
        formData.append('video', this.formData.video);
        formData.append('duration', this.videoDuration);
      }

      if (this.selectedType === 'VBL' || this.selectedType === 'BT') {
        formData.append('banner', this.formData.banner);
      }

      this.videosService.updateVideo(this.dataVideoTemp.id, formData).subscribe({
        next: (response) => {
          this.createVideoButton = false;
          if (response.original.success) {
            this.getVideos();
            this.toggleFormUpdateVideos();
            Swal.fire({
              title: '¡Video creado!',
              text: response.original.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });
          } else {
            this.loadingTable = false;
            Swal.fire({
              title: '¡Ups! Algo salió mal',
              text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        }, error: (error) => {
          this.createVideoButton = false;
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudo actualizar el video.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
    }
  }

  /**
   * Se validara el texto a mostrar en la tabla segun el tipo
   * @param type 
   * @returns string
   */
  getTypeVideo(type: string) {
    let typeName;
    if (type === "VT") {
      typeName = "Video con Título";
    } else if (type === "VBL") {
      typeName = "Video con Banner Lateral";
    } else if (type === "BT") {
      typeName = "Banner con Título";
    }
    return typeName;
  }

  /**
   * pipe para darle formato a la duración de cada contenido
   * @param duration 
   * @returns string
   */
  public formatDuration(duration: any): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  }

  /**
  * pipe para dar formato a el tipo date de la tabla de videos
  * @param timeString : string or null
  * @return date : retorna el dato seteado para mostrarlo al usuario
  */
  convertToDate(timeString: string | null): Date | null {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  /**
   * Validación de vista de formulario
   */
  public clearForm() {
    this.formData = {};
    this.dataVideoTemp = {};
    this.videoDuration = null;
  }

  /**
  * Editar individualmente el video seleccionado
  * @param id : number
  */
  public editViewVideo(id: number) {
    this.dataVideoTemp = this.dataVideo.find((u: any) => u.id === id);
    if (this.dataVideoTemp) {
      this.formData = {
        title: this.dataVideoTemp.title || ''
      };
      this.selectedType = this.dataVideoTemp.type;
      this.formUpdateVideos = true;
    }
  }

  /**
   * Eliminar video
   * @param id 
   */
  public deleteVideo(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el video permanentemente. ¡No podrás revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingTable = true;
        this.videosService.deleteVideo(id).subscribe({
          next: (response) => {
            this.getVideos();
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El video ha sido eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          },
          error: (error) => {
            this.loadingTable = false;
            Swal.fire({
              title: '¡Ups! Algo salió mal',
              text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        });
      }
    });
  }

  /**
   * Programación de videos por horarios
   * @param id 
   */
  schedule(id: number) {
    Swal.fire({
      title: 'Programar Video',
      html: `
        <p>El formato de fecha es 24 horas</p>
            <input type="time" id="timeInput" class="swal2-input" required>
        `,
      showCancelButton: true,
      confirmButtonText: 'Programar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const timeInput = (document.getElementById('timeInput') as HTMLInputElement).value;
        if (!timeInput) {
          Swal.showValidationMessage('Por favor selecciona una hora');
          return false;
        }
        return timeInput;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingTable = true;
        let data = {
          'execution_time': result.value,
          'video_id': id
        }
        this.videosService.scheduleVideo(data).subscribe({
          next: (response) => {
            if (response.original.success) {
              Swal.fire({
                title: 'Éxito!',
                text: 'El video ha sido programado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK',
              });
            } else {
              Swal.fire({
                title: 'Advertencia!',
                text: response.original.message,
                icon: 'warning',
                confirmButtonText: 'OK',
              });
            }
            this.getVideos();
          }, error: (error) => {
            Swal.fire({
              title: '¡Ups! Algo salió mal',
              text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        });
      }
    });
  }




}
