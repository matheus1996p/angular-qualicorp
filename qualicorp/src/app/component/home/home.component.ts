import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api-service.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  profissoes = [];
  entidades = [];
  planos = [];
  ufs = [];
  cidades = [];


  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService) {}

  ngOnInit(): void {
     // this.buscarProfissoes('SP', 'SÃOPAULO');
     // this.buscarEntidades('Advogado', 'SP', 'SÃOPAULO');
     // this.buscarPlanos('CAASP', 'SP', 'SÃOPAULO', ['1987-09-16']);
      this.buscarEstados();
      this.buscarCidades();
  }

  buscarProfissoes(uf: string, cidade: string) {
      this.apiService.getProfissoes(uf, cidade)
          .subscribe((data: any) =>{
            this.profissoes = data;
            console.log(this.profissoes);
          })
  }

  buscarEntidades(profissao: string, uf: string, cidade: string){
       this.apiService.getEntidades(profissao, uf, cidade)
           .subscribe((data: any) =>{
              this.entidades = data;
              console.log(this.entidades);
           });
  }

  buscarPlanos(entidade: string, uf: string, cidade: string, datanascimento: any[]){
        this.apiService.getPlanos(entidade, uf, cidade, datanascimento)
            .subscribe((data:any) =>{
                this.planos = data;
                console.log(this.planos);
            })
  }

  buscarEstados(){
      this.apiService.getEstados()
          .subscribe((data:any) =>{
              this.ufs = data;
              console.log(this.ufs);
          })
  }

  buscarCidades(){
      this.apiService.getCidades(35)
          .subscribe((data:any) =>{
              this.cidades = data;
              console.log(this.cidades);
          })
  }
}
