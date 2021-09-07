import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

  filtrosUfs!: Observable<any[]>;
  filtroCidades!: Observable<any[]>;


  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService) {
      this.formulario = this.formBuilder.group({
          nome: this.nome,
          email: this.email,
          estado: this.estado,
          cidade: this.cidade
      });
  }

  @ViewChild('estadoSearch') estadoSearch!: ElementRef;

  ngOnInit(): void {
      // this.buscarProfissoes('SP', 'SÃOPAULO');
     // this.buscarEntidades('Advogado', 'SP', 'SÃOPAULO');
     // this.buscarPlanos('CAASP', 'SP', 'SÃOPAULO', ['1987-09-16']);
      this.cidade.disable();
      this.buscarEstados();
      // this.buscarCidades(35);

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
  }

  onInputChange(){
      console.log(this.estadoSearch.nativeElement.value);
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
              this.ufs.sort(function (a,b) {
                  return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
              });
              console.log(this.ufs);
          })
  }

  buscarCidades(estado: any){
      this.apiService.getCidades(estado)
          .subscribe((data:any) =>{
              this.cidades = data;
              this.cidade.enable();
              console.log(this.cidades);
          })
  }

  resetaCampos(){
      if(this.estado.hasError('required')){
          this.cidade.setValue('');
          this.cidade.disable();
      }
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

  getErrorMessageCidade() {
        return this.estado.hasError('required') ? 'O campo Cidade é obrigatório.' : '';
  }

  criar(){

  }

  private _filterEstado(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.ufs.filter(option => option.nome.toLowerCase().includes(filterValue));
  }
  private _filterCidade(name: string): any[] {
        const filterValue = name.toLowerCase();

        return this.cidades.filter(option => option.nome.toLowerCase().includes(filterValue));
  }


    selectedEstado(event: any) {
      this.formulario.controls['cidade'].setValue('');
      this.cidade.disable();
      this.buscarCidades(event.option.value.id);
    }

    selectedCidade(event: any) {
        console.log(event.option.value);
    }

    displayFn(estado: any): string {
        return estado && estado.nome ? estado.nome : '';
    }

    displayFnCidade(cidade: any): string {
        return cidade && cidade.nome ? cidade.nome : '';
    }
}
