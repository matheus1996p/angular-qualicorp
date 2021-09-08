import { Component, OnInit } from '@angular/core';
import {TransfereService} from "../../services/transfere.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit {

  data = this.transfereService.getData();

  constructor(private transfereService:TransfereService,
              private router:Router) { }

  ngOnInit(): void {
    if(this.data){
      console.log('dados transferidos');
      console.log(this.data);
    }
  }

}
