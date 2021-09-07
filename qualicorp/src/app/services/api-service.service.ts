import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getProfissoes(uf: string, cidade: string){
    return this.http.get(`${environment.apiUrl}/profissoes/${uf}/${cidade}`);
  }

  getEntidades(profissao: string, uf: string, cidade: string){
    return this.http.get(`${environment.apiUrl}/entidades/${profissao}/${uf}/${cidade}`);
  }

  getPlanos(entidade: string, uf: string, cidade: string, datanascimento: any[]){
    let params = new HttpParams()
        .set('entidade', entidade)
        .set('cidade', cidade)
        .set('uf', uf);
    datanascimento.forEach(data =>{
       params = params.append('datanascimento', data);
    });
    return this.http.post(`${environment.apiUrl}/planos`, params);
  }

  getEstados(){
    return this.http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
  }

  getCidades(uf: number){
    return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`);
  }

}
