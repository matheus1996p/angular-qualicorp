import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api-service.service";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import * as moment from 'moment';
import {TransfereService} from "../../services/transfere.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  profissoes: any[] = [];
  entidades: any[] = [];
  planos: any[] = [];
  ufs: any[] = [];
  cidades: any[] = [];

  formulario: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  nome = new FormControl('', [Validators.required]);
  estado = new FormControl('', [Validators.required]);
  cidade = new FormControl('', [Validators.required]);
  profissao = new FormControl('', [Validators.required]);
  entidade = new FormControl('', [Validators.required]);
  datanascimento = new FormControl('', [Validators.required, this.dateValidator]);

  filtrosUfs!: Observable<any[]>;
  filtroCidades!: Observable<any[]>;
  filtroProfissoes!: Observable<any[]>;
  filtroEntidades!: Observable<any[]>;

  formValido: boolean = false;
  isLoading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private transfereService:TransfereService,
              private apiService: ApiService,
              private router: Router) {
      this.formulario = this.formBuilder.group({
          nome: this.nome,
          email: this.email,
          estado: this.estado,
          cidade: this.cidade,
          profissao: this.profissao,
          entidade: this.entidade,
          datanascimento: this.datanascimento
      });
  }

  ngOnInit(): void {
      this.cidade.disable();
      this.profissao.disable();
      this.entidade.disable();
      this.buscarEstados();

      this.filtrosUfs = this.estado.valueChanges
          .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.nome),
              map(nome => nome ? this._filterEstado(nome) : this.ufs.slice())
          );

      this.filtroCidades = this.cidade.valueChanges
          .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.nome),
              map(nome => nome ? this._filterCidade(nome) : this.cidades.slice())
          );

      this.filtroProfissoes = this.profissao.valueChanges
          .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.profissao),
              map(nome => nome ? this._filterProfissao(nome) : this.profissoes.slice())
          );

      this.filtroEntidades = this.entidade.valueChanges
          .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.RazaoSocial),
              map(nome => nome ? this._filterEntidade(nome) : this.entidades.slice())
          );
  }

  buscarProfissoes(uf: string, cidade: string) {
      this.apiService.getProfissoes(uf, cidade)
          .subscribe((data: any) =>{
            this.profissoes = data;
            this.profissao.enable();
          })
  }

  buscarEntidades(profissao: string, uf: string, cidade: string){
       this.apiService.getEntidades(profissao, uf, cidade)
           .subscribe((data: any) =>{
              this.entidades = data;
              this.entidade.enable();
           });
  }

  buscarPlanos(entidade: string, uf: string, cidade: string, datanascimento: any[]){
        this.apiService.getPlanos(entidade, uf, cidade, datanascimento)
            .subscribe((data:any) =>{
                this.planos = data;
                this.transfereService.setData(this.planos);
                this.router.navigateByUrl('/planos');
                this.isLoading = false;
            })
  }

  buscarEstados(){
      this.apiService.getEstados()
          .subscribe((data:any) =>{
              this.ufs = data;
              this.ufs.sort(function (a,b) {
                  return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
              });
          })
  }

  buscarCidades(estado: any){
      this.apiService.getCidades(estado)
          .subscribe((data:any) =>{
              this.cidades = data;
              this.cidade.enable();
          })
  }

  resetaCampos(){
      if(this.estado.hasError('required')){
          this.cidade.setValue('');
          this.cidade.disable();
          this.profissao.setValue('');
          this.profissao.disable();
      }
      if(this.cidade.hasError('required')){
          this.profissao.setValue('');
          this.profissao.disable();
      }
      if(this.profissao.hasError('required')){
          this.entidade.setValue('');
          this.entidade.disable();
      }

  }

  getErrorMessageEmail() {
        if (this.email.hasError('required')) {
            return 'O campo E-mail ?? obrigat??rio.';
        }
        return this.email.hasError('email') ? 'O campo E-mail deve ser um email v??lido' : '';
  }

  getErrorMessageNome() {
        return this.nome.hasError('required') ? 'O campo Nome ?? obrigat??rio.' : '';
  }

  getErrorMessageEstado() {
        return this.estado.hasError('required') ? 'O campo Estado ?? obrigat??rio.' : '';
  }

  getErrorMessageCidade() {
        return this.estado.hasError('required') ? 'O campo Cidade ?? obrigat??rio.' : '';
  }

  getErrorMessageProfissao() {
        return this.profissao.hasError('required') ? 'O campo Profiss??o ?? obrigat??rio.' : '';
  }

  getErrorMessageEntidade() {
        return this.profissao.hasError('required') ? 'O campo Entidade ?? obrigat??rio.' : '';
  }

  getErrorMessageDate(){
      return this.datanascimento.hasError('required') ? 'Informe um data v??lida.' : '';
  }

  dateValidator(control: FormControl){
      if (control.value) {
          const date = moment(control.value);
          const today = moment();
          if (!date.isValid()) {
              return { 'invalidDate': true }
          }
      }
      return null;
  }

  formatDate(date: string) {
      let separada = date.split('/');
      let dia = separada[0];
      let mes = separada[1];
      let ano = separada[2];

      return [ano, mes, dia].join('-');
    }

  criar(){
      this.isLoading = true;
      let dataFormatada = [];
          dataFormatada.push(this.formatDate(this.formulario.controls['datanascimento'].value._i));
      this.buscarPlanos(this.formulario.controls['entidade'].value.NomeFantasia, this.formulario.controls['estado'].value.sigla,
          this.formulario.controls['cidade'].value.nome, ['1987-09-16']);
  }

  private _filterEstado(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.ufs.filter(option => option.nome.toLowerCase().includes(filterValue));
  }
  private _filterCidade(name: string): any[] {
        const filterValue = name.toLowerCase();

        return this.cidades.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  private _filterProfissao(name: string): any[] {
        const filterValue = name.toLowerCase();

        return this.profissoes.filter(option => option.profissao.toLowerCase().includes(filterValue));
  }

  private _filterEntidade(name: string): any[] {
        const filterValue = name.toLowerCase();

        return this.entidades.filter(option => option.RazaoSocial.toLowerCase().includes(filterValue));
  }


    selectedEstado(event: any) {
      this.formulario.controls['cidade'].setValue('');
      this.cidade.disable();
      this.buscarCidades(event.option.value.id);
    }

    selectedCidade(event: any) {
        this.profissao.disable();
        this.buscarProfissoes(this.formulario.controls['estado'].value.sigla, event.option.value.nome);
    }

    selectedProfissao(event: any) {
      this.entidade.disable();
      this.buscarEntidades(event.option.value.profissao, this.formulario.controls['estado'].value.sigla,
          this.formulario.controls['cidade'].value.nome);
    }

    selectedEntidade(event: any) {
      this.formValido = true;
    }

    displayFn(estado: any): string {
        return estado && estado.nome ? estado.nome : '';
    }

    displayFnCidade(cidade: any): string {
        return cidade && cidade.nome ? cidade.nome : '';
    }

    displayFnProfissao(profissao: any): string {
        return profissao && profissao.profissao ? profissao.profissao : '';
    }

    displayFnEntidade(entidade: any): string {
        return entidade && entidade.NomeFantasia ? entidade.NomeFantasia : '';
    }
}
