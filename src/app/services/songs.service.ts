import { Song, SongFolder } from './../types/song.type';
import { environment } from './../../environments/environment';
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(
    private http: HttpClient,
  ) { }

  getFilecontentUrl(fileId: string): string {
    return `${environment.apiUrl}/${environment.apiUnsecure}/googleDrive/fileContent?id=${fileId}`;
  }

  getFileContent(fileId: string): Observable<any> {
    return this.http.get<any[]>(this.getFilecontentUrl(fileId));
  }

  public getSong(songName: string): Observable<Song> {
    return this.http.get<Song>(`${environment.apiUrl}/${environment.apiSecure}/googleDrive/song?name=${songName}`)
    .pipe(
      tap(song => {
        console.log('song', song);
      }),
      catchError(this.handleError<Song>(`${environment.apiUrl}/${environment.apiSecure}/googleDrive/song`, null))
    );
  }

  public getSongFolders(): Observable<SongFolder[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/${environment.apiSecure}/googleDrive/songFolders`)
    .pipe(
      tap(files => {
        console.log('songFolders', files);
      }),
      catchError(this.handleError<any[]>(`${environment.apiUrl}/${environment.apiSecure}/googleDrive/songFolders`, []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
