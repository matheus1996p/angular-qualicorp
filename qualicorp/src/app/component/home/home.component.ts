import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api-service.service";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  profissoes = [];
  entidades = [];
  planos = [];
  ufs: any[] = [];
  cidades: any[] = [];

  formulario: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  nome = new FormControl('', [Validators.required]);
  estado = new FormControl('', [Validators.required]);
  cidade = new FormControl('', [Validators.required]);


  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService) {
      this.formulario = this.formBuilder.group({
          nome: this.nome,
          email: this.email
      });
  }

  ngOnInit(): void {
      // this.buscarProfissoes('SP', 'SÃOPAULO');
     // this.buscarEntidades('Advogado', 'SP', 'SÃOPAULO');
     // this.buscarPlanos('CAASP', 'SP', 'SÃOPAULO', ['1987-09-16']);
      this.buscarEstados();
      this.buscarCidades(35);
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

  buscarCidades(estado: any){
      this.apiService.getCidades(estado)
          .subscribe((data:any) =>{
              this.cidades = data;
              console.log(this.cidades);
          })
  }

  getErrorMessageEmail() {
        if (this.email.hasError('required')) {
            return 'O campo E-mail é obrigatório.';
        }
        return this.email.hasError('email') ? 'O campo E-mail deve ser um email válido' : '';
  }

  getErrorMessageNome() {
        return this.nome.hasError('required') ? 'O campo Nome é obrigatório.' : '';
  }

  getErrorMessageEstado() {
        return this.estado.hasError('required') ? 'O campo Estado é obrigatório.' : '';
  }

  criar(){

  }

  private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();

        return this.ufs.filter(option => option.nome.toLowerCase().includes(filterValue));
  }
}
