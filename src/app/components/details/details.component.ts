import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit,OnDestroy {

  nGameRating=0; 
  gameId!: string;
  game!: Game;
  routeSub!: Subscription;
  gameSub!: Subscription;

  constructor(private activatedRoute:ActivatedRoute,private oDataService:DataService){}

  ngOnInit()
  {
    this.routeSub=this.activatedRoute.params.subscribe((params:Params)=>{
      this.gameId=params['id'];
      this.DetailsComponent_GetGameDetails(this.gameId)

    })
  }

  DetailsComponent_GetGameDetails(id:string)
  {
    this.gameSub=this.oDataService.DataService_GetGameDetails(id).subscribe({
      next:(result:Game)=>{
        console.log("DetailsComponent_GetGameDetails---------Response",result)

        this.game=result;

        setTimeout(() => {
          this.nGameRating=this.game.metacritic;
        }, 1000);
      },
      error:(error)=>{
        console.error("DetailsComponent_GetGameDetails---------Error",error)
      },
      complete:()=>{}
    })
  }

  DetailsComponent_GetColor(value:number):string{
    if(value>75){
      return '#5ee432'
    }else if(value>50){
      return '#fffa50'
    }else if(value>30){
      return '#f7aa38'
    }else {
      return '#ef4655'
    }
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
