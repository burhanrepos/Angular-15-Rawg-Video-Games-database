import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {
  sSelectedSort:string='';
  lFilters=[
    {displayName:'Name',value:'name'},
    {displayName:'Released',value:'-released'},
    {displayName:'Added',value:'-added'},
    {displayName:'Created',value:'-created'},
    {displayName:'Updated',value:'-updated'},
    {displayName:'Rating',value:'-rating'},
    {displayName:'Metacritic',value:'metacritic'},
  ]

  games: Array<Game> = [];
  routeSub: Subscription = new Subscription;
  gameSub:Subscription | undefined;


  constructor(private oDataService:DataService,private activatedRoute:ActivatedRoute,private oRouter:Router){}

  ngOnInit(): void {
    this.routeSub=this.activatedRoute.params.subscribe((params:Params)=>{
      if(params['game-search']){
        this.HomeComponent_SearchGames('metacrit',params['game-search']);
      }
      else
      {
        this.HomeComponent_SearchGames('metacrit');
      }
    })
  }

  HomeComponent_SearchGames(sort:string, search?: string)
  {
    let body={
      ordering:sort,
      search:search
    }
    this.gameSub=this.oDataService.DataService_GetGameList(body).subscribe(
      {
        next:(result:APIResponse<Game>)=>{
          console.log("DataService_GetGameList========Response",result);
          this.games=result.results;
           
        },
        error:(error)=>{
          console.error("DataService_GetGameList========Error",error)
        },
        complete:()=>{}
      }
      )
  }
  HomeComponent_OpenGameDetail(onIncomingGameId:string)
  {
    console.log("HomeComponent_OpenGameDetail========",onIncomingGameId);
    this.oRouter.navigate(['details',onIncomingGameId])
  }
  ngOnDestroy()
  {
    if(this.gameSub)
    {
      this.gameSub.unsubscribe()
    }
    if(this.routeSub)
    {
      this.routeSub.unsubscribe()
    }
  }

}
