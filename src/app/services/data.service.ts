import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment as env} from 'src/environments/environment.prod';
import { APIResponse, Game } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  DataService_GetGameList(body:any):Observable<APIResponse<Game>>{
    let params = new HttpParams().set('ordering',body.ordering)
    if(body.search)
    {
     params = new HttpParams().set('ordering',body.ordering).set('search',body.search)
    }
    return this.http.get<APIResponse<Game>>(env.BASE_URL + '/games',{params:params});
  }

  DataService_GetGameDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`);
    // const gameTrailersRequest = this.http.get(
    //   `${env.BASE_URL}/games/${id}/movies`
    // );
    // const gameScreenshotsRequest = this.http.get(
    //   `${env.BASE_URL}/games/${id}/screenshots`
    // );

    return forkJoin({
      gameInfoRequest,
      // gameScreenshotsRequest,
      // gameTrailersRequest,
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          // screenshots: resp['gameScreenshotsRequest']?.results,
          // trailers: resp['gameTrailersRequest']?.results,
        };
      })
    );
  }

}
